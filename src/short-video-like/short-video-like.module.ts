import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortVideoLikeEntity } from './entity/ShortVideoLike';
import { ShortVideoLikeService } from './short-video-like.service';
import { ShortVideoLikeController } from './short-video-like.controller';
import { UsersModule } from 'src/users/users.module';
import { ShortVideoModule } from 'src/short-video/short-video.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortVideoLikeEntity]), UsersModule, ShortVideoModule],
  controllers: [ShortVideoLikeController],
  providers: [ShortVideoLikeService],
  exports: [ShortVideoLikeService],
})
export class ShortVideoLikeModule {} 