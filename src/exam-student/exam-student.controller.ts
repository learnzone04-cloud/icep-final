import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ExamStudentService } from './exam-student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exam-student')
export class ExamStudentController {
  constructor(private readonly examStudentService: ExamStudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':examId/mark')
  async setMark(
    @Param('examId') examId: number,
    @Body('mark') mark: number,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.examStudentService.setMark(examId, userId, mark);
  }
} 