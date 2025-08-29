import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentType } from './entity/StudentType';
import { StudentTypeController } from './student-type.controller';
import { StudentModule } from 'src/student/student.module';
import { Student } from 'src/student/entity/Student';

@Module({
  imports: [TypeOrmModule.forFeature([StudentType, Student]), StudentModule],
  controllers: [StudentTypeController],
  providers: [],
  exports: [],
})
export class StudentTypeModule {}
