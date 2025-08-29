import { Module } from '@nestjs/common';
import { ReelsService } from './reels.service';
import { ReelsController } from './reels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReelEntity } from './entity/Reel';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import { RecommendationModule } from 'src/recommendation/recommendation.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReelEntity]), UsersModule, NotificationModule, RecommendationModule],
  providers: [ReelsService],
  controllers: [ReelsController],
  exports: [ReelsService],
})
export class ReelsModule {}
