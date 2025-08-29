import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { ExamQuestionService } from './exam-question.service';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';

@Controller('exam-question')
export class ExamQuestionController {
  constructor(private readonly examQuestionService: ExamQuestionService) {}

  @Post()
  async create(@Body() createExamQuestionDto: CreateExamQuestionDto, @Headers('examid') examId: string) {
    return await this.examQuestionService.create(createExamQuestionDto, Number(examId));
  }

  @Get()
  findAll() {
    return this.examQuestionService.findAll();
  }

  @Get('exam/:examId')
  findAllByExamId(@Param('examId') examId: string) {
    return this.examQuestionService.findAllByExamId(+examId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examQuestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamQuestionDto: UpdateExamQuestionDto) {
    return this.examQuestionService.update(+id, updateExamQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examQuestionService.remove(+id);
  }
}
