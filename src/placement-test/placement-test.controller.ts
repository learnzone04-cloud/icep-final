import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PlacementTestService } from './placement-test.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('placement-test')
export class PlacementTestController {
  constructor(private readonly placementTestService: PlacementTestService) {}

  @Post('generate-questions')
  async generateQuestions(@Body('typeId') typeId: number) {
    return this.placementTestService.generateQuestions(typeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-answers')
  async submitAnswers(
    @Req() req: any,
    @Body('answers') answers: any,
    @Body('test') test: any,
    @Body('typeId') typeId: number,
  ) {
    const studentId = req.user?.studentId;
    return this.placementTestService.evaluateAnswers(studentId, answers, test, typeId);
  }
}
