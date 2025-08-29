import { Controller, Post, Get, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonRescheduleDto } from './dto/create-lesson-reschedule.dto';
import { CreateLessonBatchDto } from './dto/create-lesson-batch.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('book')
  async bookLesson(@Body() createDto: CreateLessonDto) {
    return await this.lessonService.bookLesson(createDto);
  }

  @Post('batch')
  async createLessonsBatch(@Body() dto: CreateLessonBatchDto) {
    return this.lessonService.createLessonsBatch(dto);
  }

  @Get('teacher')
  @UseGuards(AuthGuard('jwt'))
  async getLessonsByTeacher(@Request() req) {
    return this.lessonService.getLessonsByTeacher(req.user.Id);
  }

  @Get('student')
  @UseGuards(AuthGuard('jwt'))
  async getLessonsByStudent(@Request() req) {
    return this.lessonService.getLessonsByStudent(req.user.Id);
  }

  @Get('chat/:chatId')
  async getLessonsByChat(@Param('chatId') chatId: number) {
    return this.lessonService.getLessonsByChat(chatId);
  }

  @Get('available-slots/:teacherId')
  async getAvailableTimeSlots(
    @Param('teacherId') teacherId: number,
    @Query('date') date: string
  ) {
    return await this.lessonService.getAvailableTimeSlots(teacherId, date);
  }

  @Post('reschedule/request')
  async requestReschedule(@Body() createRescheduleDto: CreateLessonRescheduleDto) {
    return await this.lessonService.requestReschedule(createRescheduleDto);
  }

  @Put('reschedule/:rescheduleId/approve')
  async approveReschedule(@Param('rescheduleId') rescheduleId: number) {
    return await this.lessonService.approveReschedule(rescheduleId);
  }

  @Put('reschedule/:rescheduleId/reject')
  async rejectReschedule(
    @Param('rescheduleId') rescheduleId: number,
    @Body() body: { reason?: string }
  ) {
    return await this.lessonService.rejectReschedule(rescheduleId, body.reason);
  }

  @Put(':lessonId/complete')
  async completeLesson(@Param('lessonId') lessonId: number) {
    return await this.lessonService.completeLesson(lessonId);
  }

  @Put(':lessonId/cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancelLesson(@Param('lessonId') lessonId: number) {
    return await this.lessonService.cancelLesson(lessonId);
  }
} 