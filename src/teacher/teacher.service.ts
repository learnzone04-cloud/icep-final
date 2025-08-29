import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherEntity } from './entity/Teacher';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { UpdateTeacherDto } from './dtos/update-teacher.dto';
import { UpdateTeacherProfileDto } from './dtos/update-teacher-profile.dto';
import { UsersService } from 'src/users/users.service';
import { TypesService } from 'src/types/types.service';
import { CertificateEntity } from 'src/certificate/entities/certificate.entity';
import { ArticleEntity } from 'src/article/entity/Article';
import { ReelEntity } from 'src/reels/entity/Reel';
import { Course } from 'src/course/entities/course.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Follower } from 'src/follower/entities/follower.entity';
import { StudentService } from 'src/student/student.service';
import { RateService } from 'src/rate/rate.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(CertificateEntity)
    private certificateRepo: Repository<CertificateEntity>,
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(ReelEntity)
    private reelRepo: Repository<ReelEntity>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(Follower)
    private followerRepo: Repository<Follower>,
    private readonly userService: UsersService,
    private readonly typeService: TypesService,
    private readonly studentService: StudentService,
    private readonly rateService: RateService,
  ) {}

  async createTeacher(
    id: number,
    cvPath: string | undefined,
    certificatePaths: string[],
    data: CreateTeacherDto,
  ) {
    const user = await this.userService.findOneById(id);
    const type = await this.typeService.findOneById(data.typeId);
    const teacher = this.teacherRepo.create(data);
    teacher.user = user;
    teacher.type = type;
    teacher.cv = cvPath;

    const tt = await this.teacherRepo.save(teacher);

    const certificatePromises = certificatePaths.map(async (path) => {
      const certificate = this.certificateRepo.create({
        teacherId: tt.id,
        certificate: path,
      });
      certificate.teacher = teacher;
      return this.certificateRepo.save(certificate);
    });

    await Promise.all(certificatePromises);
    return tt;
  }

  find() {
    return this.teacherRepo.find();
  }

  private async checkFollowStatus(userId: number, teacherId: number): Promise<boolean> {
    console.log('Checking follow status for user:', userId, 'and teacher:', teacherId);
    const studentId = await this.studentService.getStudentIdByUserId(userId);
    console.log('Found student ID:', studentId);
    const follower = await this.followerRepo.findOne({
      where: { studentId, teacherId }
    });
    return !!follower;
  }

  async findByUserType(user: any) {
    console.log('User from JWT:', user);
    console.log('User role:', user.role);
    console.log('User typeId:', user.typeId);
    
    // If user is a student, filter by their type and add follow status
    if (user.role === 'Student' && user.typeId) {
      console.log('Filtering teachers for student with typeId:', user.typeId);
      const teachers = await this.teacherRepo.find({
        where: { typeId: user.typeId },
        relations: ['user', 'type', 'certificate'],
      });
      
      // Add follow status for each teacher
      const teachersWithFollowStatus = await Promise.all(
        teachers.map(async (teacher) => {
          const isFollowing = await this.checkFollowStatus(user.id, teacher.id);
          return {
            ...teacher,
            isFollowing
          };
        })
      );
      
      console.log('Found teachers for student:', teachersWithFollowStatus.map(t => ({ 
        id: t.id, 
        typeId: t.typeId, 
        name: `${t.user?.fName} ${t.user?.lName}`,
        isFollowing: t.isFollowing
      })));
      return teachersWithFollowStatus;
    }
    
    // If user is a teacher, return all teachers
    if (user.role === 'Teacher') {
      console.log('Teacher requesting all teachers');
      const teachers = await this.teacherRepo.find({
        relations: ['user', 'type', 'certificate'],
      });
      console.log('Found all teachers:', teachers.map(t => ({ 
        id: t.id, 
        typeId: t.typeId, 
        name: `${t.user?.fName} ${t.user?.lName}` 
      })));
      return teachers;
    }
    
    // If no valid role or other cases, return empty array
    console.log('No valid role found, returning empty array');
    return [];
  }

  async findOneByUserType(user: any, teacherId: number) {
    console.log('User requesting specific teacher:', user.id, 'teacherId:', teacherId);
    
    // If user is a student, check if teacher has matching type
    if (user.role === 'Student' && user.typeId) {
      console.log('Student requesting teacher with typeId:', user.typeId);
      const teacher = await this.teacherRepo.findOne({
        where: { 
          id: teacherId,
          typeId: user.typeId 
        },
        relations: ['user', 'type', 'certificate'],
      });
      
      if (!teacher) {
        console.log('Teacher not found or type mismatch');
        return null;
      }
      
      // Add follow status for the teacher
      const isFollowing = await this.checkFollowStatus(user.id, teacher.id);
      // Add average rating for the teacher
      const averageRating = await this.rateService.getAverageRatingByTeacherId(teacher.id);
      const teacherWithFollowStatus = {
        ...teacher,
        isFollowing,
        averageRating,
      };
      
      console.log('Found teacher for student:', { 
        id: teacher.id, 
        typeId: teacher.typeId, 
        name: `${teacher.user?.fName} ${teacher.user?.lName}`,
        isFollowing,
        averageRating,
      });
      return teacherWithFollowStatus;
    }
    
    // If user is a teacher, return any teacher
    if (user.role === 'Teacher') {
      console.log('Teacher requesting specific teacher');
      const teacher = await this.teacherRepo.findOne({
        where: { id: teacherId },
        relations: ['user', 'type', 'certificate'],
      });
      // Add average rating for the teacher
      const averageRating = teacher ? await this.rateService.getAverageRatingByTeacherId(teacher.id) : null;
      const teacherWithAverage = teacher ? { ...teacher, averageRating } : null;
      console.log('Found teacher:', teacherWithAverage ? { 
        id: teacherWithAverage.id, 
        typeId: teacherWithAverage.typeId, 
        name: `${teacherWithAverage.user?.fName} ${teacherWithAverage.user?.lName}`,
        averageRating,
      } : null);
      return teacherWithAverage;
    }
    
    // If no valid role or other cases, return null
    console.log('No valid role found, returning null');
    return null;
  }

  findOneByUser(id: number) {
    return this.teacherRepo.findOne({
      where: { userId: id}
    });
  }

  findOneById(id: number) {
    return this.teacherRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async delete(id: number) {
    const findTeacher = await this.findOneById(id);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');

    return this.teacherRepo.remove(findTeacher);
  }

  async update(id: number, data: UpdateTeacherDto) {
    const findTeacher = await this.findOneById(id);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');
    Object.assign(findTeacher, data);
    return this.teacherRepo.save(findTeacher);
  }

  async updateProfile(userId: number, data: UpdateTeacherProfileDto) {
    const findTeacher = await this.findOneByUser(userId);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');
    
    console.log('Updating teacher profile:', data);
    if (data.facebookUrl !== undefined) findTeacher.facebookUrl = data.facebookUrl;
    if (data.instagramUrl !== undefined) findTeacher.instagramUrl = data.instagramUrl;
    if (data.cv !== undefined) findTeacher.cv = data.cv;

    // Update certificates if provided
    if (data.certificates !== undefined) {
      // Remove all existing certificates for this teacher
      await this.certificateRepo.delete({ teacherId: findTeacher.id });
      // Add new certificates
      if (Array.isArray(data.certificates)) {
        const certificateEntities = data.certificates.map(certPath => {
          return this.certificateRepo.create({
            teacherId: findTeacher.id,
            certificate: certPath,
          });
        });
        await this.certificateRepo.save(certificateEntities);
      }
    }
    Object.assign(findTeacher, data);
    console.log('Updated teacher profile:', findTeacher);
    return this.teacherRepo.save(findTeacher);
  }

  async updateCV(userId: number, newCvFilename: string) {
    const findTeacher = await this.findOneByUser(userId);
    if (!findTeacher) throw new NotFoundException('Teacher Not Found');
    
    // Delete old CV file if it exists
    if (findTeacher.cv) {
      const oldCvPath = path.join(process.cwd(), 'uploads', 'teacher', findTeacher.cv);
      try {
        if (fs.existsSync(oldCvPath)) {
          fs.unlinkSync(oldCvPath);
        }
      } catch (error) {
        console.error('Error deleting old CV file:', error);
      }
    }
    
    // Update with new CV filename
    findTeacher.cv = newCvFilename;
    return this.teacherRepo.save(findTeacher);
  }

  async getTeacherArticles(userId: number) {
    const articles = await this.articleRepo.find({
      where: { userId: userId },
      relations: ['user', 'type'],
      order: { createdAt: 'DESC' },
    });

    return articles;
  }

  async getTeacherReels(userId: number) {
    const reels = await this.reelRepo.find({
      where: { userId: String(userId) },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return reels;
  }

  async getTeacherCourses(userId: number) {
    const teacher = await this.findOneByUser(userId);
    if (!teacher) throw new NotFoundException('Teacher Not Found');

    const courses = await this.courseRepo.find({
      where: { teacherId: Number(teacher.id) },
      relations: ['teacher', 'teacher.user', 'type'],
    });

    return courses;
  }
}