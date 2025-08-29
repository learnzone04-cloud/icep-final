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
import { ArticleCommentService } from './article-comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('article-comment')
export class ArticleCommentController {
  constructor(private readonly service: ArticleCommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  commentArticle(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { content: string },
  ): any {
    return this.service.createArticleComment(id, req.user.id, body);
  }

  @Get()
  getArticleComments() {
    return this.service.find();
  }

  @Get('/:id')
  getArtcleOneLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.findArticleOneComment(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
