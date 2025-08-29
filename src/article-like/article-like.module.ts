import { Module } from '@nestjs/common';
import { ArticleLikeService } from './article-like.service';
import { ArticleLikeController } from './article-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleLike } from './entity/ArticleLike';
import { ArticleModule } from 'src/article/article.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleLike]),
    ArticleModule,
    UsersModule,
  ],
  providers: [ArticleLikeService],
  controllers: [ArticleLikeController],
})
export class ArticleLikeModule {}
