import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entity/User';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { CertificateEntity } from '../certificate/entities/certificate.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(TeacherEntity) private teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(CertificateEntity) private certificateRepo: Repository<CertificateEntity>,
  ) {}

  createUser(data: CreateUserDto) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  find() {
    return this.userRepo.find();
  }

  findOne(email: any) {
    if (!email) {
      return null;
    }
    return this.userRepo.findOne({
      where: { email: email },
    });
  }

  async findTeacherRequest() {
    const users = await this.userRepo.find({
      relations: ['teacher', 'teacher.certificate'],
    });

    return users.filter(
      (user) => user.role === 'Teacher' && user.active === false,
    );
  }

  async findPendingTeacherRequests() {
    const users = await this.userRepo.find({
      relations: ['teacher'],
      where: {
        role: UserRole.Teacher,
        active: false
      }
    });

    // Filter only users who have a teacher record
    const pendingTeachers = users.filter(user => user.teacher);

    // Map to return only the required fields
    return pendingTeachers.map(user => ({
      id: user.id,
      name: `${user.fName} ${user.lName}`,
      email: user.email,
      teacherCreatedAt: user.teacher.createdAt,
      phoneNumber: user.phoneNumber
    }));
  }

  async findApprovedTeachers() {
    const users = await this.userRepo.find({
      relations: ['teacher'],
      where: {
        role: UserRole.Teacher,
        active: true
      }
    });

    // Filter only users who have a teacher record
    const approvedTeachers = users.filter(user => user.teacher);

    // Map to return only the required fields
    return approvedTeachers.map(user => ({
      id: user.id,
      name: `${user.fName} ${user.lName}`,
      email: user.email,
      teacherCreatedAt: user.teacher.createdAt,
      phoneNumber: user.phoneNumber
    }));
  }

  async findAllStudentsOrderedByType() {
    const users = await this.userRepo.find({
      relations: ['student', 'student.studentTypes', 'student.studentTypes.type'],
      where: {
        role: UserRole.Student,
        active: true
      }
    });

    // Filter only users who have a student record
    const students = users.filter(user => user.student);

    // Map to return students with their types
    const studentsWithTypes = students.map(user => ({
      id: user.id,
      name: `${user.fName} ${user.lName}`,
      email: user.email,
      phoneNumber: user.phoneNumber,
      studentCreatedAt: user.createdAt,
      types: user.student.studentTypes.map(studentType => ({
        typeId: studentType.type.id,
        typeName: studentType.type.name
      }))
    }));

    // Separate students with single type vs multiple types
    const singleTypeStudents = studentsWithTypes.filter(student => student.types.length === 1);
    const multipleTypeStudents = studentsWithTypes.filter(student => student.types.length > 1);

    // Group single type students by type
    const studentsByType: { [key: string]: any[] } = {};
    singleTypeStudents.forEach(student => {
      const typeName = student.types[0].typeName;
      if (!studentsByType[typeName]) {
        studentsByType[typeName] = [];
      }
      studentsByType[typeName].push(student);
    });

    // Sort students within each type group
    Object.keys(studentsByType).forEach(typeName => {
      studentsByType[typeName].sort((a, b) => a.name.localeCompare(b.name));
    });

    // Sort multiple type students by name
    multipleTypeStudents.sort((a, b) => a.name.localeCompare(b.name));

    return {
      studentsByType,
      multipleTypeStudents
    };
  }

  async findTeacherById(userId: number) {
    const user = await this.userRepo.findOne({
      relations: ['teacher', 'teacher.certificate'],
      where: {
        id: userId,
        role: UserRole.Teacher
      }
    });

    if (!user || !user.teacher) {
      return null;
    }

    return {
      id: user.id,
      fName: user.fName,
      lName: user.lName,
      phoneNumber: user.phoneNumber,
      active: user.active,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      teacher: {
        id: user.teacher.id,
        facebookUrl: user.teacher.facebookUrl,
        instagramUrl: user.teacher.instagramUrl,
        coverLetter: user.teacher.coverLetter,
        cv: user.teacher.cv,
        userId: user.teacher.userId,
        typeId: user.teacher.typeId,
        createdAt: user.teacher.createdAt,
        certificate: user.teacher.certificate || []
      }
    };
  }

  findOneById(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepo.findOne({
      where: { id: id },
      relations: [
        'teacher',
        'teacher.type',
        'student',
        'student.notes',
        'student.words',
        'student.studentTypes',
      ],
    });
  }

  async delete(id: number) {
    const findUser = await this.findOneById(id);
    if (!findUser) throw new NotFoundException('User Not Found');

    return this.userRepo.remove(findUser);
  }

  async update(id: number, data: UpdateUserDto) {
    const findUser = await this.findOneById(id);
    if (!findUser) throw new NotFoundException('User Not Found');
    Object.assign(findUser, data);
    return this.userRepo.save(findUser);
  }

  async deleteTeacherRecord(teacherId: number) {
    // First delete all certificates associated with this teacher
    const certificates = await this.certificateRepo.find({ where: { teacherId } });
    if (certificates.length > 0) {
      await this.certificateRepo.remove(certificates);
    }

    // Then delete the teacher record
    const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } });
    if (teacher) {
      return this.teacherRepo.remove(teacher);
    }
    return null;
  }
}
