import { Module } from '@nestjs/common';
import { ArticleReedService } from './article-reed.service';
import { ArticleReedController } from './article-reed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRead } from './entity/ArticleReed';
import { ArticleModule } from 'src/article/article.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleRead]),
    ArticleModule,
    UsersModule,
  ],
  providers: [ArticleReedService],
  controllers: [ArticleReedController],
})
export class ArticleReedModule {}
