import { Module } from '@nestjs/common';
import { CourseVideoService } from './course-video.service';
import { CourseVideoController } from './course-video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseVideoEntity } from './entity/course-video.entity';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { CourseModule } from 'src/course/course.module';
import { AdminAuthModule } from 'src/admin-auth/admin-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseVideoEntity]), YoutubeModule, CourseModule, AdminAuthModule],
  providers: [CourseVideoService],
  controllers: [CourseVideoController],
  exports: [CourseVideoService],
})
export class CourseVideoModule {}
