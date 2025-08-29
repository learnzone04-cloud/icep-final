import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortVideoCommentEntity } from './entity/ShortVideoComment';
import { ShortVideoCommentService } from './short-video-comment.service';
import { ShortVideoCommentController } from './short-video-comment.controller';
import { UsersModule } from 'src/users/users.module';
import { ShortVideoModule } from 'src/short-video/short-video.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortVideoCommentEntity]), UsersModule, ShortVideoModule],
  controllers: [ShortVideoCommentController],
  providers: [ShortVideoCommentService],
  exports: [ShortVideoCommentService],
})
export class ShortVideoCommentModule {} 