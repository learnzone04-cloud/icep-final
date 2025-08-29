import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { Rate } from './entities/rate.entity';
import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';

@Module({
  imports: [TypeOrmModule.forFeature([Rate, Student, TeacherEntity])],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
