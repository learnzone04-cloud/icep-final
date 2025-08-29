import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ShortVideoLikeService } from './short-video-like.service';
import { CreateShortVideoLikeDto } from './dtos/create-short-video-like.dto';

@Controller('short-video-likes')
export class ShortVideoLikeController {
  constructor(private readonly shortVideoLikeService: ShortVideoLikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:shortVideoId/toggle')
  toggleShortVideoLike(
    @Param('shortVideoId', ParseIntPipe) shortVideoId: number,
    @Req() req,
  ) {
    return this.shortVideoLikeService.toggleShortVideoLike(shortVideoId, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getShortVideoLikes() {
    return this.shortVideoLikeService.find();
  }

  @Get('/:shortVideoId')
  @UseGuards(JwtAuthGuard)
  getLikesForShortVideo(@Param('shortVideoId', ParseIntPipe) shortVideoId: number) {
    return this.shortVideoLikeService.findLikeForShortVideo(shortVideoId);
  }

  @Get('/:shortVideoId/check')
  @UseGuards(JwtAuthGuard)
  checkUserLike(@Param('shortVideoId', ParseIntPipe) shortVideoId: number, @Req() req) {
    return this.shortVideoLikeService.checkUserLike(shortVideoId, req.user.id);
  }

  @Get('/:shortVideoId/status')
  @UseGuards(JwtAuthGuard)
  checkUserLikeStatus(@Param('shortVideoId', ParseIntPipe) shortVideoId: number, @Req() req) {
    return this.shortVideoLikeService.checkUserLikeStatus(shortVideoId, req.user.id);
  }

  @Get('/:shortVideoId/count')
  getShortVideoLikeCount(@Param('shortVideoId', ParseIntPipe) shortVideoId: number) {
    return this.shortVideoLikeService.getShortVideoLikeCount(shortVideoId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteShortVideoLike(@Param('id', ParseIntPipe) id: number) {
    return this.shortVideoLikeService.delete(id);
  }
} 