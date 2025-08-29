import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './entities/follower.entity';
import { StudentModule } from 'src/student/student.module';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follower]), StudentModule, TeacherModule],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
