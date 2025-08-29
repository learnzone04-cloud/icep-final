import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { Story } from './entity/Story';
import { StoryLike } from './entity/StoryLike';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { Follower } from '../follower/entities/follower.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import * as fs from 'fs';
import { StoryGateway } from './story.gateway';
import { FollowerService } from '../follower/follower.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>,
    @InjectRepository(StoryLike)
    private readonly storyLikeRepo: Repository<StoryLike>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Follower)
    private readonly followerRepo: Repository<Follower>,
    private readonly storyGateway: StoryGateway,
    private readonly followerService: FollowerService,
  ) {}

  async createStory(teacherId: number, createStoryDto: CreateStoryDto): Promise<Story> {
    // Validate story data
    if (!createStoryDto.mediaUrl && !createStoryDto.content) {
      throw new BadRequestException('Must provide either media URL or content');
    }

    // Set expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = this.storyRepo.create({
      ...createStoryDto,
      teacherId,
      expiresAt,
    });
    const savedStory = await this.storyRepo.save(story);

    // Emit real-time event to followers
    const followerUserIds = await this.followerService.getFollowerUserIdsForTeacher(teacherId);
    this.storyGateway.emitStoryCreated(savedStory, followerUserIds);

    return savedStory;
  }

  async getStoriesForStudent(studentId: number): Promise<Story[]> {
    // Get all teachers that this student follows
    const followedTeachers = await this.followerRepo.find({
      where: { studentId },
      relations: ['teacher'],
    });

    if (followedTeachers.length === 0) {
      return [];
    }

    const teacherIds = followedTeachers.map(f => f.teacherId);
    const now = new Date();

    // Get non-expired stories from followed teachers
    return this.storyRepo.find({
      where: {
        teacherId: In(teacherIds),
        expiresAt: MoreThan(now), // Stories that haven't expired yet
        isExpired: false,
      },
      relations: ['teacher', 'teacher.user', 'likes'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTeacherStories(teacherId: number): Promise<Story[]> {
    const now = new Date();
    
    return this.storyRepo.find({
      where: {
        teacherId,
        expiresAt: MoreThan(now), // Stories that haven't expired yet
        isExpired: false,
      },
      relations: ['likes', 'likes.student', 'likes.student.user', 'teacher', 'teacher.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async likeStory(storyId: number, studentId: number): Promise<void> {
    // Check if story exists and is not expired
    const story = await this.storyRepo.findOne({
      where: { id: storyId },
      relations: ['teacher'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.isExpiredNow) {
      throw new BadRequestException('Cannot like expired story');
    }

    // Check if student follows the teacher
    const isFollowing = await this.followerRepo.findOne({
      where: { studentId, teacherId: story.teacherId },
    });

    if (!isFollowing) {
      throw new ForbiddenException('You can only like stories from teachers you follow');
    }

    // Check if already liked
    const existingLike = await this.storyLikeRepo.findOne({
      where: { storyId, studentId },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this story');
    }

    // Create like
    const like = this.storyLikeRepo.create({
      storyId,
      studentId,
    });

    await this.storyLikeRepo.save(like);
  }

  async deleteStory(storyId: number, teacherId: number): Promise<void> {
    const story = await this.storyRepo.findOne({
      where: { id: storyId, teacherId },
    });

    if (!story) {
      throw new NotFoundException('Story not found or you do not have permission to delete it');
    }

    // Delete the file if it exists
    if (story.mediaUrl && fs.existsSync(story.mediaUrl)) {
      try {
        fs.unlinkSync(story.mediaUrl);
        console.log(`Deleted story file: ${story.mediaUrl}`);
      } catch (error) {
        console.error(`Failed to delete story file ${story.mediaUrl}:`, error);
      }
    }

    // Delete all likes first
    await this.storyLikeRepo.delete({ storyId });
    
    // Delete the story
    await this.storyRepo.remove(story);
    // Emit real-time event to followers
    const followerUserIds = await this.followerService.getFollowerUserIdsForTeacher(teacherId);
    this.storyGateway.emitStoryDeleted(storyId, followerUserIds);
  }

  async getStoryLikes(storyId: number): Promise<StoryLike[]> {
    return this.storyLikeRepo.find({
      where: { storyId },
      relations: ['student', 'student.user'],
    });
  }



  // Method to clean up expired stories (can be called manually or via cron)
  async cleanupExpiredStories() {
    const now = new Date();
    
    // Get stories that are about to expire or have expired
    const expiredStories = await this.storyRepo.find({
      where: { 
        expiresAt: LessThan(now),
        isExpired: false 
      },
      select: ['id', 'mediaUrl']
    });

    // Delete files for expired stories
    for (const story of expiredStories) {
      if (story.mediaUrl && fs.existsSync(story.mediaUrl)) {
        try {
          fs.unlinkSync(story.mediaUrl);
          console.log(`Deleted file: ${story.mediaUrl}`);
        } catch (error) {
          console.error(`Failed to delete file ${story.mediaUrl}:`, error);
        }
      }
    }

    // Mark expired stories
    await this.storyRepo.update(
      { 
        expiresAt: LessThan(now),
        isExpired: false 
      },
      { isExpired: true }
    );

    // Delete stories that expired more than 7 days ago (including their likes)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const oldStories = await this.storyRepo.find({
      where: { expiresAt: LessThan(sevenDaysAgo) },
      select: ['id', 'mediaUrl']
    });

    // Delete files for old stories
    for (const story of oldStories) {
      if (story.mediaUrl && fs.existsSync(story.mediaUrl)) {
        try {
          fs.unlinkSync(story.mediaUrl);
          console.log(`Deleted old story file: ${story.mediaUrl}`);
        } catch (error) {
          console.error(`Failed to delete old story file ${story.mediaUrl}:`, error);
        }
      }
    }

    // Delete likes for old stories first
    await this.storyLikeRepo.delete({
      storyId: In(oldStories.map(s => s.id))
    });

    // Delete old stories
    await this.storyRepo.delete({
      expiresAt: LessThan(sevenDaysAgo),
    });
  }
} 

 
 