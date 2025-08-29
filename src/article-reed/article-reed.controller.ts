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
import { ArticleReedService } from './article-reed.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('article-read')
export class ArticleReedController {
  constructor(private readonly service: ArticleReedService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  readArticle(@Request() req, @Param('id', ParseIntPipe) id: number): any {
    return this.service.createArticleRead({ articleId: id, id: req.user.id });
  }

  @Get('/:id')
  getArticleReadOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findArticleReed(id);
  }

  @Get()
  getArticleReads() {
    return this.service.find();
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteLike(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
