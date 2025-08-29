import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReelLikeService } from './reel-like.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reel-like')
export class ReelLikeController {
  constructor(private readonly service: ReelLikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  toggleReelLike(@Request() req, @Param('id', ParseIntPipe) id: number): any {
    return this.service.toggleReelLike(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/status')
  checkUserLikeStatus(@Request() req, @Param('id', ParseIntPipe) id: number): any {
    return this.service.checkUserLikeStatus(id, req.user.id);
  }

  @Get('/:id/count')
  getReelLikeCount(@Param('id', ParseIntPipe) id: number): any {
    return this.service.getReelLikeCount(id);
  }

  @Get('/:id')
  getReelLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.findLikeForReel(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
