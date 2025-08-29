import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReelCommentService } from './reel-comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reel-comment')
export class ReelCommentController {
  constructor(private readonly service: ReelCommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  likeReel(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { content: string },
  ): any {
    return this.service.createReel(id, req.user.id, body);
  }

  @Get('/:id')
  getReelComment(@Param('id', ParseIntPipe) id: number) {
    return this.service.findCommentForReel(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
