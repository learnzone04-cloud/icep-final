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
import { ArticleLikeService } from './article-like.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('article-like')
export class ArticleLikeController {
  constructor(private readonly service: ArticleLikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  toggleArticleLike(@Request() req, @Param('id', ParseIntPipe) id: number): any {
    return this.service.toggleArticleLike(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/status')
  checkUserLikeStatus(@Request() req, @Param('id', ParseIntPipe) id: number): any {
    return this.service.checkUserLikeStatus(id, req.user.id);
  }

  @Get('/:id/count')
  getArticleLikeCount(@Param('id', ParseIntPipe) id: number): any {
    return this.service.getArticleLikeCount(id);
  }

  @Get('/:id')
  getArticleLikeOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findArticleOneLike(id);
  }

  @Get()
  getArticleLikes() {
    return this.service.find();
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
