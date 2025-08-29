import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { UserEntity } from '../users/entity/User';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { ReelEntity } from '../reels/entity/Reel';
import { ArticleEntity } from '../article/entity/Article';
import { ShortVideoEntity } from '../short-video/entity/ShortVideo';
import { Course } from '../course/entities/course.entity';
import { EnrollCourseStudent } from '../enroll-course-student/entity/EnrollCourseStudent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TeacherEntity,
      ReelEntity,
      ArticleEntity,
      ShortVideoEntity,
      Course,
      EnrollCourseStudent,
    ]),
  ],
  controllers: [StatisticsController],
})
export class StatisticsModule {} 