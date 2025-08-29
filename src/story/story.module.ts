import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Story } from './entity/Story';
import { StoryLike } from './entity/StoryLike';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { Follower } from '../follower/entities/follower.entity';
import { StoryGateway } from './story.gateway';
import { FollowerService } from '../follower/follower.service';
import { AuthModule } from '../auth/auth.module';
import { StudentModule } from '../student/student.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      StoryLike,
      TeacherEntity,
      Student,
      Follower,
    ]),
    MulterModule.register({
      dest: './uploads/stories',
    }),
    AuthModule,
    StudentModule,
    TeacherModule,
  ],
  providers: [StoryService, StoryGateway, FollowerService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule {} 