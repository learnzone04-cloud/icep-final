import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/Tag';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), TeacherModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}



