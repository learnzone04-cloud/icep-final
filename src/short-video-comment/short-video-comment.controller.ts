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
import { ShortVideoCommentService } from './short-video-comment.service';
import { CreateShortVideoCommentDto } from './dtos/create-short-video-comment.dto';

@Controller('short-video-comments')
export class ShortVideoCommentController {
  constructor(private readonly shortVideoCommentService: ShortVideoCommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:shortVideoId')
  createShortVideoComment(
    @Param('shortVideoId', ParseIntPipe) shortVideoId: number,
    @Req() req,
    @Body() createShortVideoCommentDto: CreateShortVideoCommentDto,
  ) {
    return this.shortVideoCommentService.createShortVideoComment(shortVideoId, req.user.id, { content: createShortVideoCommentDto.content });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getShortVideoComments() {
    return this.shortVideoCommentService.find();
  }

  @Get('/:shortVideoId')
  @UseGuards(JwtAuthGuard)
  getCommentsForShortVideo(@Param('shortVideoId', ParseIntPipe) shortVideoId: number) {
    return this.shortVideoCommentService.findCommentForShortVideo(shortVideoId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteShortVideoComment(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.shortVideoCommentService.delete(id, req.user);
  }
} 