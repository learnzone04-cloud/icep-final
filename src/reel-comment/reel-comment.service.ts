import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReelCommentEntity } from './entity/ReelComment';
import { UsersService } from 'src/users/users.service';
import { ReelsService } from 'src/reels/reels.service';
import { Repository } from 'typeorm';

@Injectable()
export class ReelCommentService {
  constructor(
    @InjectRepository(ReelCommentEntity)
    private reelLikeRepo: Repository<ReelCommentEntity>,
    private readonly userService: UsersService,
    private readonly reelService: ReelsService,
  ) {}

  async createReel(reelId: number, id: number, data: { content: string }) {
    const user = await this.userService.findOneById(id);
    const reel = await this.reelService.findOneById(reelId);
    const reelLike = this.reelLikeRepo.create(data);
    reelLike.reel = reel;
    reelLike.student = user;
    return this.reelLikeRepo.save(reelLike);
  }

  find() {
    return this.reelLikeRepo.find({ relations: ['student'] });
  }

  findCommentForReel(id: number) {
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
    if (!findReel) throw new NotFoundException('Teacher Not Found');

    return this.reelLikeRepo.remove(findReel);
  }
}
