import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SavedArticleService } from './saved-article.service';
import { SaveArticleDto } from './dto/save-article.dto';

@Controller('saved-articles')
@UseGuards(JwtAuthGuard)
export class SavedArticleController {
  constructor(private readonly savedArticleService: SavedArticleService) {}

  @Post()
  async saveArticle(@Body() saveArticleDto: SaveArticleDto, @Req() req) {
    const userId = req.user.id;
    return this.savedArticleService.saveArticle(userId, saveArticleDto);
  }

  @Delete(':articleId')
  async unsaveArticle(@Param('articleId', ParseIntPipe) articleId: number, @Req() req) {
    const userId = req.user.id;
    return this.savedArticleService.unsaveArticle(userId, articleId);
  }



  @Get()
  async getSavedArticles(@Req() req) {
    const userId = req.user.id;
    return this.savedArticleService.getSavedArticles(userId);
  }

  @Get('check/:articleId')
  async isArticleSaved(@Param('articleId', ParseIntPipe) articleId: number, @Req() req) {
    const userId = req.user.id;
    return this.savedArticleService.isArticleSaved(userId, articleId);
  }
} 