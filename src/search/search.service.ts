import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async searchAll(name: string, user: any) {
    const searchTerm = name?.toLowerCase() || '';
    const typeFilter = user.role === 'Student' ? { typeId: user.typeId } : {};

    // Search teachers by user name (fName + lName)
    const teacherQuery = this.teacherRepo
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('LOWER(CONCAT(user.fName, " ", user.lName)) LIKE :name', { name: `%${searchTerm}%` });
    if (user.role === 'Student') {
      teacherQuery.andWhere('teacher.typeId = :typeId', { typeId: user.typeId });
    }
    const teachers = await teacherQuery.getMany();

    // Search courses by title
    const courseQuery = this.courseRepo
      .createQueryBuilder('course')
      .where('LOWER(course.title) LIKE :name', { name: `%${searchTerm}%` });
    if (user.role === 'Student') {
      courseQuery.andWhere('course.typeId = :typeId', { typeId: user.typeId });
    }
    const courses = await courseQuery.getMany();

    // Format results
    const teacherResults = teachers.map(t => ({
      id: t.id,
      name: t.user ? `${t.user.fName} ${t.user.lName}` : '',
      type: 'teacher',
    }));
    const courseResults = courses.map(c => ({
      id: c.id,
      name: c.title,
      type: 'course',
    }));

    return [...teacherResults, ...courseResults];
  }
} 