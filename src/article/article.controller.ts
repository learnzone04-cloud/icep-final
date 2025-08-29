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
  Patch,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  addArticle(@Request() req, @Body() body: CreateArticleDto): any {
    return this.service.createArticle(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getArticles(@Request() req) {
    return this.service.findByUserType(req.user);
  }

  // New endpoint: Get articles with recommendation scoring for students
  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getArticlesWithRecommendations(@Request() req) {
    const userId = req.user?.id;
    const typeId = req.user?.typeId; // Get typeId from JWT token
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!typeId) {
      throw new Error('User type not found in token');
    }

    return this.service.findArticlesWithRecommendations(userId, typeId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateArticleDto
  ) {
    return this.service.update(id, body);
  }
}
