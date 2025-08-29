import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('follow')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:teacherId')
  create(@Request() req: any, @Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.followerService.create(req.user.id, teacherId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findMyFollowers(@Request() req: any) {
    return this.followerService.findMyFollowers(req.user);
  }

  @Delete('/:teacherId')
  @UseGuards(JwtAuthGuard)
  unfollowTeacher(@Request() req: any, @Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.followerService.unfollowTeacher(req.user, teacherId);
  }

  @Delete('/removefollower/:studentId')
  @UseGuards(JwtAuthGuard)
  removeFollower(@Request() req: any, @Param('studentId', ParseIntPipe) studentId: number) {
    return this.followerService.removeFollower(req.user, studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/toggle/:teacherId')
  toggleFollow(@Request() req: any, @Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.followerService.toggleFollow(req.user.id, teacherId);
  }
}
