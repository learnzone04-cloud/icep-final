// src/exam/exam.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CourseModule } from 'src/course/course.module'; // Import CourseModule
import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity'; // Import CourseVideoEntity
import { ExamQuestion } from 'src/exam-question/entities/exam-question.entity'; // Import ExamQuestion
import { Student } from '../student/entity/Student';
import { ExamStudent } from '../exam-student/exam-student.entity';
import { TeacherEntity } from 'src/teacher/entity/Teacher';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, CourseVideoEntity, ExamQuestion, ExamStudent, Student,TeacherEntity]),
    CourseModule,
  ],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}