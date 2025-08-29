import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson } from './entity/Lesson';
import { LessonReschedule } from './entity/LessonReschedule';
import { GoogleCalendarService } from '../google-calendar.service';
import { UserEntity } from '../users/entity/User';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { LessonSchedulerService } from './lesson-scheduler.service';
import { GoogleCalendarModule } from '../google-calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lesson,
      LessonReschedule,
      UserEntity,
    ]),
    AdminAuthModule,
    GoogleCalendarModule,
  ],
  controllers: [LessonController],
  providers: [LessonService, LessonSchedulerService],
  exports: [LessonService],
})
export class LessonModule {} 