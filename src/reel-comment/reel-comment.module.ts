import { Module } from '@nestjs/common';
import { ReelCommentService } from './reel-comment.service';
import { ReelCommentController } from './reel-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReelCommentEntity } from './entity/ReelComment';
import { ReelsModule } from 'src/reels/reels.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReelCommentEntity]),
    ReelsModule,
    UsersModule,
  ],
  providers: [ReelCommentService],
  controllers: [ReelCommentController],
})
export class ReelCommentModule {}
