import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReelLikeEntity } from './entity/ReelLike';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ReelsService } from 'src/reels/reels.service';
import { ReelLikeResponseDto } from './dto/reel-like-response.dto';

@Injectable()
export class ReelLikeService {
  constructor(
    @InjectRepository(ReelLikeEntity)
    private reelLikeRepo: Repository<ReelLikeEntity>,
    private readonly userService: UsersService,
    private readonly reelService: ReelsService,
  ) {}

  async toggleReelLike(reelId: number, userId: number): Promise<ReelLikeResponseDto> {
    // Check if user and reel exist
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reel = await this.reelService.findOneById(reelId);
    if (!reel) {
      throw new NotFoundException('Reel not found');
    }

    // Check if user already liked this reel
    const existingLike = await this.reelLikeRepo.findOne({
      where: { reelId, studentId: userId.toString() }
    });

    if (existingLike) {
      // User already liked, so remove the like
      await this.reelLikeRepo.remove(existingLike);
      
      return {
        action: 'unliked',
        message: 'Reel unliked successfully',
        isLiked: false,
        likeCount: await this.getReelLikeCount(reelId)
      };
    } else {
      // User hasn't liked, so add the like
      const newLike = this.reelLikeRepo.create({
        reelId,
        studentId: userId.toString()
      });
      
      await this.reelLikeRepo.save(newLike);
      
      return {
        action: 'liked',
        message: 'Reel liked successfully',
        isLiked: true,
        likeCount: await this.getReelLikeCount(reelId)
      };
    }
  }

  async getReelLikeCount(reelId: number): Promise<number> {
    return this.reelLikeRepo.count({
      where: { reelId }
    });
  }

  async checkUserLikeStatus(reelId: number, userId: number): Promise<boolean> {
    const like = await this.reelLikeRepo.findOne({
      where: { reelId, studentId: userId.toString() }
    });
    return !!like;
  }

  find() {
    return this.reelLikeRepo.find({ relations: ['student'] });
  }

  findLikeForReel(id: number) {
    return this.reelLikeRepo.find({
      where: { reelId: id },
      relations: ['student'],
    });
  }

  findOneById(id: number) {
    return this.reelLikeRepo.findOne({
      where: { id: id },
    });
  }

  async delete(id: number) {
    const findReel = await this.findOneById(id);
    if (!findReel) throw new NotFoundException('Reel Like Not Found');

    return this.reelLikeRepo.remove(findReel);
  }
}
