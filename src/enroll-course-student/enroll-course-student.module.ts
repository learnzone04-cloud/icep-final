import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollCourseStudent } from './entity/EnrollCourseStudent.entity';
import { Student } from '../student/entity/Student';
import { Course } from '../course/entities/course.entity';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { CourseVideoProgressModule } from '../course-video-progress/course-video-progress.module';
import { DiscountsModule } from 'src/discounts/discounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnrollCourseStudent, Student, Course]),
    CourseVideoProgressModule,
    DiscountsModule,
  ],
  providers: [EnrollmentService],
  controllers: [EnrollmentController],
  exports: [TypeOrmModule],
})
export class EnrollCourseStudentModule {} 