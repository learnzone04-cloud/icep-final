import { Module } from '@nestjs/common';
import { ArticleCommentService } from './article-comment.service';
import { ArticleCommentController } from './article-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleComment } from './entity/ArticleComment';
import { UsersModule } from 'src/users/users.module';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleComment]),
    UsersModule,
    ArticleModule,
  ],
  providers: [ArticleCommentService],
  controllers: [ArticleCommentController],
})
export class ArticleCommentModule {}
