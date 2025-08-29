import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/Article';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import { RecommendationModule } from 'src/recommendation/recommendation.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), UsersModule, NotificationModule, RecommendationModule],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
