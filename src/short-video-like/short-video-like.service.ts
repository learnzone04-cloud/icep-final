import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortVideoLikeEntity } from './entity/ShortVideoLike';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ShortVideoService } from 'src/short-video/short-video.service';
import { ShortVideoLikeResponseDto } from './dto/short-video-like-response.dto';

@Injectable()
export class ShortVideoLikeService {
  constructor(
    @InjectRepository(ShortVideoLikeEntity)
    private shortVideoLikeRepo: Repository<ShortVideoLikeEntity>,
    private readonly userService: UsersService,
    private readonly shortVideoService: ShortVideoService,
  ) {}

  async toggleShortVideoLike(shortVideoId: number, studentId: number): Promise<ShortVideoLikeResponseDto> {
    const user = await this.userService.findOneById(studentId);
    const shortVideo = await this.shortVideoService.findOneById(shortVideoId);
    
    if (!shortVideo) {
      throw new NotFoundException('Short Video Not Found');
    }
    
    // Check if like already exists for this student and video
    const existingLike = await this.shortVideoLikeRepo.findOne({
      where: {
        shortVideoId: shortVideoId,
        studentId: studentId.toString()
      }
    });
    
    if (existingLike) {
      // If like exists, remove it (unlike)
      await this.shortVideoLikeRepo.remove(existingLike);
      return {
        action: 'unliked',
        message: 'Short video unliked successfully',
        isLiked: false,
        likeCount: await this.getShortVideoLikeCount(shortVideoId)
      };
    } else {
      // If like doesn't exist, create it (like)
      const shortVideoLike = this.shortVideoLikeRepo.create({
        shortVideoId,
        studentId: studentId.toString()
      });
      await this.shortVideoLikeRepo.save(shortVideoLike);
      return {
        action: 'liked',
        message: 'Short video liked successfully',
        isLiked: true,
        likeCount: await this.getShortVideoLikeCount(shortVideoId)
      };
    }
  }

  async getShortVideoLikeCount(shortVideoId: number): Promise<number> {
    return this.shortVideoLikeRepo.count({
      where: { shortVideoId }
    });
  }

  async checkUserLikeStatus(shortVideoId: number, studentId: number): Promise<boolean> {
    const like = await this.shortVideoLikeRepo.findOne({
      where: { shortVideoId, studentId: studentId.toString() }
    });
    return !!like;
  }

  find() {
    return this.shortVideoLikeRepo.find({ relations: ['student'] });
  }

  findLikeForShortVideo(id: number) {
    return this.shortVideoLikeRepo.find({
      where: { shortVideoId: id },
      relations: ['student'],
    });
  }

  findOneById(id: number) {
    return this.shortVideoLikeRepo.findOne({
      where: { id: id },
    });
  }

  async checkUserLike(shortVideoId: number, studentId: number) {
    const existingLike = await this.shortVideoLikeRepo.findOne({
      where: {
        shortVideoId: shortVideoId,
        studentId: studentId.toString()
      }
    });
    
    return {
      isLiked: !!existingLike,
      likeId: existingLike?.id || null
    };
  }

  async delete(id: number) {
    const findShortVideoLike = await this.findOneById(id);
    if (!findShortVideoLike) throw new NotFoundException('Short Video Like Not Found');

    return this.shortVideoLikeRepo.remove(findShortVideoLike);
  }
} 