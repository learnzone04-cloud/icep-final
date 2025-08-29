import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseVideoProgress } from './entity/CourseVideoProgress.entity';
import { CourseVideoProgressService } from './course-video-progress.service';
import { CourseVideoProgressController } from './course-video-progress.controller';
import { Student } from '../student/entity/Student';
import { Course } from '../course/entities/course.entity';
import { CourseVideoEntity } from '../course-video/entity/course-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseVideoProgress, Student, Course, CourseVideoEntity])],
  providers: [CourseVideoProgressService],
  controllers: [CourseVideoProgressController],
  exports: [CourseVideoProgressService],
})
export class CourseVideoProgressModule {} 