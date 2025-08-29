import { Module } from '@nestjs/common';
import { ReelLikeService } from './reel-like.service';
import { ReelLikeController } from './reel-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReelLikeEntity } from './entity/ReelLike';
import { UsersModule } from 'src/users/users.module';
import { ReelsModule } from 'src/reels/reels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReelLikeEntity]),
    UsersModule,
    ReelsModule,
  ],
  providers: [ReelLikeService],
  controllers: [ReelLikeController],
})
export class ReelLikeModule {}
