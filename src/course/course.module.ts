import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { TeacherModule } from 'src/teacher/teacher.module';
import { TypeEntity } from 'src/types/entity/Type';
import { TypesModule } from 'src/types/types.module';
import { CourseVideoEntity } from '../course-video/entity/course-video.entity';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { UserEntity } from '../users/entity/User';
import { NotificationModule } from 'src/notification/notification.module';
import { DiscountsModule } from 'src/discounts/discounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseVideoEntity,
      TeacherEntity,
      UserEntity,
    ]),
    TeacherModule,
    TypesModule,
    NotificationModule,
    DiscountsModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService]
})
export class CourseModule {}
