// src/exam/exam.controller.ts

import { Controller, Post, Body, Patch, Param, Delete, Req, UseGuards, Get, ParseIntPipe } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  async create(@Body() createExamDto: CreateExamDto): Promise<Exam> {
    return this.examService.create(createExamDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.examService.remove(+id);
  }

  @Get('video/:videoId/course/:courseId')
  @UseGuards(JwtAuthGuard)
  async getSpecificVideoExam(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Param('courseId', ParseIntPipe) courseId: number
  ) {
    return this.examService.getSpecificVideoExam(videoId, courseId);
  }

  @Get('student-mid-final/:courseId')
  @UseGuards(JwtAuthGuard)
  async getStudentMidFinalExams(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() req
  ) {
    const userId = req.user.id;
    return this.examService.getStudentMidFinalExams(userId, courseId);
  }

  @Get('by-teacher/course/:courseId')
  @UseGuards(JwtAuthGuard)
  async getExamsByTeacherAndCourse(
    @Req() req,
    @Param('courseId', ParseIntPipe) courseId: number
  ) {
    return this.examService.getExamsByTeacherAndCourse(req.user.id, courseId);
  }
}