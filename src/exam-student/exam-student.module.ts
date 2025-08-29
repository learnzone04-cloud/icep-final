import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamStudent } from './exam-student.entity';
import { Student } from '../student/entity/Student';
import { Exam } from '../exam/entities/exam.entity';
import { EnrollCourseStudent } from '../enroll-course-student/entity/EnrollCourseStudent.entity';
import { ExamStudentService } from './exam-student.service';
import { ExamStudentController } from './exam-student.controller';
import { CourseVideoProgressModule } from '../course-video-progress/course-video-progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamStudent, Student, Exam, EnrollCourseStudent]),
    CourseVideoProgressModule,
  ],
  providers: [ExamStudentService],
  controllers: [ExamStudentController],
  exports: [ExamStudentService],
})
export class ExamStudentModule {} 