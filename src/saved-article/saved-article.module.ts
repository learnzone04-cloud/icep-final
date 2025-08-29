import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedArticle } from './entity/SavedArticle';
import { SavedArticleService } from './saved-article.service';
import { SavedArticleController } from './saved-article.controller';
import { Student } from '../student/entity/Student';
import { ArticleEntity } from '../article/entity/Article';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedArticle, Student, ArticleEntity]),
  ],
  controllers: [SavedArticleController],
  providers: [SavedArticleService],
  exports: [SavedArticleService],
})
export class SavedArticleModule {} 