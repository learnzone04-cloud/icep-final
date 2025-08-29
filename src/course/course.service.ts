import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { TeacherService } from 'src/teacher/teacher.service';
import { TypesService } from 'src/types/types.service';
import { NotificationService } from 'src/notification/notification.service';
import { DiscountsService } from 'src/discounts/discounts.service';

@Injectable()
export class CourseService {
  constructor (
    @InjectRepository(Course) private repo : Repository<Course> ,
    private teacherService: TeacherService,
    private typeService: TypesService,
    private notificationService: NotificationService,
    private discountsService: DiscountsService,
  ) {}
  
  async create(userId: number,data: CreateCourseDto) {
    const teacher = await this.teacherService.findOneByUser(userId);
    const type = await this.typeService.findOneById(data.typeId);
    data.teacherId = teacher.id;
    const course = this.repo.create(data);
    course.teacher = teacher;
    course.type = type;
    // Remove the line that sets videosNumber to 0 - let user set it
    if (data.level) {
      course.level = data.level;
    }
    if (data.passGrade !== undefined && data.passGrade !== null) {
      if (data.passGrade <= 10 || data.passGrade >= 80) {
        throw new Error('passGrade must be greater than 10 and less than 80');
      }
      course.passGrade = data.passGrade;
    }
    if (data.hasPassFailSystem !== undefined) {
      course.hasPassFailSystem = data.hasPassFailSystem;
    }
    
    const savedCourse = await this.repo.save(course);
    
    // Send notification to followers
    try {
      const teacherName = `${teacher.user.fName} ${teacher.user.lName}`;
      await this.notificationService.sendCourseCreatedNotification(
        teacher.id,
        teacherName,
        savedCourse.id,
        savedCourse.title
      );
    } catch (error) {
      console.error('Failed to send course notification:', error);
      // Don't fail the course creation if notification fails
    }
    
    return savedCourse;
  }

  async find() {
    // Get courses that have approved videos count >= videosNumber using a single efficient query
    const courses = await this.repo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.type', 'type')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('COUNT(cv.id)')
          .from('course_video_entity', 'cv')
          .where('cv.courseId = course.id')
          .andWhere('cv.approaved = true')
          .getQuery();
        return 'EXISTS (SELECT 1 WHERE ' + subQuery + ' >= course.videosNumber)';
      })
      .getMany();
    
    // Enrich courses with discount information
    const enrichedCourses = await Promise.all(
      courses.map(course => this.discountsService.enrichCourseWithDiscount(course))
    );
    
    return enrichedCourses;
  }

  async findByUserType(user: any) {
    console.log('User from JWT:', user);
    console.log('User role:', user.role);
    console.log('User typeId:', user.typeId);
    
    // If user is a teacher, return all their courses regardless of approval status
    if (user.role === 'Teacher') {
      console.log('Filtering courses for teacher with userId:', user.id);
      const teacher = await this.teacherService.findOneByUser(user.id);
      if (teacher) {
        const teacherCourses = await this.repo
          .createQueryBuilder('course')
          .leftJoinAndSelect('course.teacher', 'teacher')
          .leftJoinAndSelect('course.type', 'type')
          .where('course.teacherId = :teacherId', { teacherId: teacher.id })
          .getMany();
        
        console.log('Found teacher courses:', teacherCourses.map(c => ({ id: c.id, teacherId: c.teacherId, title: c.title })));
        
        // Enrich courses with discount information
        const enrichedCourses = await Promise.all(
          teacherCourses.map(course => this.discountsService.enrichCourseWithDiscount(course))
        );
        
        return enrichedCourses;
      } else {
        return []; // No teacher found, return empty array
      }
    }
    
    // For students, apply the original logic with video approval filtering
    let queryBuilder = this.repo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.type', 'type')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('COUNT(cv.id)')
          .from('course_video_entity', 'cv')
          .where('cv.courseId = course.id')
          .andWhere('cv.approaved = true')
          .getQuery();
        return 'EXISTS (SELECT 1 WHERE ' + subQuery + ' >= course.videosNumber)';
      });
    
    // Filter by student's type
    if (user.role === 'Student' && user.typeId) {
      console.log('Filtering courses for student with typeId:', user.typeId);
      queryBuilder = queryBuilder.andWhere('course.typeId = :typeId', { typeId: user.typeId });
    }
    
    const courses = await queryBuilder.getMany();
    
    if (user.role === 'Student' && user.typeId) {
      console.log('Found courses for student:', courses.map(c => ({ id: c.id, typeId: c.typeId, title: c.title })));
    }
    
    // Enrich courses with discount information
    const enrichedCourses = await Promise.all(
      courses.map(course => this.discountsService.enrichCourseWithDiscount(course))
    );
    
    return enrichedCourses;
  }

  async findOne(id: number) {
    const course = await this.repo.findOne({
      where: { id: id }
    });
    
    if (!course) {
      return null;
    }
    
    // Enrich course with discount information
    return this.discountsService.enrichCourseWithDiscount(course);
  }

  async delete (id: number) {
    const course = await this.findOne(id);

    if (!course) {
      throw new Error('Course not found')
    }

    return this.repo.remove(course);
  }

  async update(id: number, data: UpdateCourseDto) {
    const course = await this.findOne(id);

    if (!course) {
      throw new Error('Course not found')
    }

    Object.assign(course, data);
    if (data.level !== undefined) {
      course.level = data.level;
    }
    if (data.passGrade !== undefined) {
      if (data.passGrade !== null && (data.passGrade < 60 || data.passGrade >= 80)) {
        throw new Error('passGrade must be greater than 60 and less than 80');
      }
      course.passGrade = data.passGrade;
    }
    if (data.hasPassFailSystem !== undefined) {
      course.hasPassFailSystem = data.hasPassFailSystem;
    }
    return this.repo.save(course);
  }
}
