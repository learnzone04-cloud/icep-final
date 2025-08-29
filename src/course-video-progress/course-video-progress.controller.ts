import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { CourseVideoProgressService } from './course-video-progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('course-video-progress')
@UseGuards(JwtAuthGuard)
export class CourseVideoProgressController {
  constructor(private readonly progressService: CourseVideoProgressService) {}

  @Get('progress/:courseId')
  async getProgress(@Param('courseId') courseId: number, @Req() req: any) {
    const userId = req.user.id;
    return this.progressService.getProgress(userId, courseId);
  }

  @Post(':videoId/unlock-next')
  async unlockNext(@Param('videoId') videoId: number, @Req() req: any) {
    const userId = req.user.id;
    const courseId = req.body.courseId;
    return this.progressService.unlockNext(userId, courseId, videoId);
  }
} 