import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortVideoEntity } from './entity/ShortVideo';
import { ShortVideoService } from './short-video.service';
import { ShortVideoController } from './short-video.controller';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import { RecommendationModule } from 'src/recommendation/recommendation.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortVideoEntity]), UsersModule, NotificationModule, RecommendationModule],
  controllers: [ShortVideoController],
  providers: [ShortVideoService],
  exports: [ShortVideoService],
})
export class ShortVideoModule {} 