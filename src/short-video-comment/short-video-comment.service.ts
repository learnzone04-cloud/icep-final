import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortVideoCommentEntity } from './entity/ShortVideoComment';
import { UsersService } from 'src/users/users.service';
import { ShortVideoService } from 'src/short-video/short-video.service';
import { Repository } from 'typeorm';

@Injectable()
export class ShortVideoCommentService {
  constructor(
    @InjectRepository(ShortVideoCommentEntity)
    private shortVideoCommentRepo: Repository<ShortVideoCommentEntity>,
    private readonly userService: UsersService,
    private readonly shortVideoService: ShortVideoService,
  ) {}

  async createShortVideoComment(shortVideoId: number, id: number, data: { content: string }) {
    const user = await this.userService.findOneById(id);
    const shortVideo = await this.shortVideoService.findOneById(shortVideoId);
    const shortVideoComment = this.shortVideoCommentRepo.create(data);
    shortVideoComment.shortVideo = shortVideo;
    shortVideoComment.student = user;
    return this.shortVideoCommentRepo.save(shortVideoComment);
  }

  find() {
    return this.shortVideoCommentRepo.find({ relations: ['student'] });
  }

  findCommentForShortVideo(id: number) {
    return this.shortVideoCommentRepo.find({
      where: { shortVideoId: id },
      relations: ['student'],
    });
  }

  findOneById(id: number) {
    return this.shortVideoCommentRepo.findOne({
      where: { id: id },
    });
  }

  async delete(id: number, user: any) {
    const findShortVideoComment = await this.findOneById(id);
    if (!findShortVideoComment) throw new NotFoundException('Short Video Comment Not Found');

    // Get the short video to check ownership
    const shortVideo = await this.shortVideoService.findOneById(findShortVideoComment.shortVideoId);
    if (!shortVideo) throw new NotFoundException('Short Video Not Found');

    // Check if user is the comment owner (student) or the short video owner (teacher)
    const isCommentOwner = findShortVideoComment.studentId === user.id;
    const isShortVideoOwner = shortVideo.teacherId === user.id;

    if (!isCommentOwner && !isShortVideoOwner) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    return this.shortVideoCommentRepo.remove(findShortVideoComment);
  }
} 