import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Course } from '../course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity, Course])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {} 