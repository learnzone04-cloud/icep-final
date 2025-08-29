import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReelEntity } from './entity/Reel';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateReelDto } from './dtos/create-reel.dto';
import { UpdateReelDto } from './dtos/update-reel.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RecommendationService } from 'src/recommendation/services/recommendation.service';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';


@Injectable()
export class ReelsService {
  constructor(
    @InjectRepository(ReelEntity)
    private reelRepo: Repository<ReelEntity>,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly recommendationService: RecommendationService,
  ) {}

  async createReel(id: number, data: CreateReelDto, videoFile?: Express.Multer.File) {
    const user = await this.userService.findOneById(id);
    
    // Check if user is a teacher and has teacher data
    if (!user.teacher) {
      throw new NotFoundException('Only teachers can create reels');
    }
    
    if (!user.teacher.type) {
      throw new NotFoundException('Teacher must have a type assigned');
    }
    
    const reel = this.reelRepo.create(data);
    reel.type = user.teacher.type;
    reel.user = user;
    
    // Extract duration from video file if provided
    if (videoFile) {
      const duration = await this.getVideoDuration(videoFile.filename);
      reel.duration = duration;
      
      // Validate duration for reels (10 seconds to 1 minute)
      if (duration < 10 || duration > 60) {
        throw new ForbiddenException('Reel duration must be between 10 seconds and 1 minute');
      }
    } else {
      throw new ForbiddenException('Video file is required for reels');
    }
    
    const savedReel = await this.reelRepo.save(reel);
    
    // Send notification to followers
    try {
      const teacherName = `${user.fName} ${user.lName}`;
      await this.notificationService.sendReelCreatedNotification(
        user.teacher.id,
        teacherName,
        savedReel.id,
        savedReel.description
      );
    } catch (error) {
      console.error('Failed to send reel notification:', error);
      // Don't fail the reel creation if notification fails
    }
    
    return savedReel;
  }

  private async getVideoDuration(filename: string): Promise<number> {
    const execAsync = promisify(exec);
    const videoPath = path.join('uploads', 'videos', filename);
    
    try {
      // Simple approach: just try 'ffprobe' and fallback gracefully
      const command = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`;
      const { stdout } = await execAsync(command);
      const duration = parseFloat(stdout.trim());
      
      if (isNaN(duration)) {
        throw new Error('Could not extract video duration');
      }
      
      return Math.round(duration);
    } catch (error) {
      console.error('Error extracting video duration:', error);
      
      // Fallback: Use a default duration and allow manual update
      console.log('FFmpeg not available. Using default duration. Duration can be updated manually.');
      return 30; // Default 30 seconds for reels
    }
  }

  find() {
    return this.reelRepo.find({
      relations: [
        'user',
        'likes',
        'likes.student',
        'comments',
        'comments.student',
      ],
    });
  }

  async findByUserType(user: any) {
    console.log('User from JWT:', user);
    console.log('User role:', user.role);
    console.log('User typeId:', user.typeId);
    
    // If user is a student, filter by their type
    if (user.role === 'Student' && user.typeId) {
      console.log('Filtering reels for student with typeId:', user.typeId);
      const reels = await this.reelRepo.find({
        where: { typeId: user.typeId },
        relations: [
          'user',
          'likes',
          'likes.student',
          'comments',
          'comments.student',
        ],
      });
      console.log('Found reels for student:', reels.map(r => ({ id: r.id, typeId: r.typeId, description: r.description })));
      return reels;
    }
    
    // If user is a teacher, return only their reels
    if (user.role === 'Teacher') {
      console.log('Filtering reels for teacher with userId:', user.id);
      const reels = await this.reelRepo.find({
        where: { userId: user.id },
        relations: [
          'user',
          'likes',
          'likes.student',
          'comments',
          'comments.student',
        ],
      });
      console.log('Found teacher reels:', reels.map(r => ({ id: r.id, userId: r.id, description: r.description })));
      return reels;
    }
    
    // If no valid role or other cases, return empty array
    console.log('No valid role found, returning empty array');
    return [];
  }

  // New method: Get reels with recommendation scoring for students
  async findReelsWithRecommendations(userId: number, userTypeId: number) {
    // Get all available reels for the user's type
    const user = await this.userService.findOneById(userId);
    
    if (!user || user.role !== 'Student') {
      throw new NotFoundException('Student not found');
    }

    // Use typeId from JWT token (passed as parameter) instead of querying database
    // This ensures we use the exact type the student is currently authenticated for
    if (!userTypeId) {
      throw new NotFoundException('User type ID is required');
    }
    
    const typeId = userTypeId;

    // Get reels filtered by user type - THIS IS CRUCIAL!
    const reels = await this.reelRepo.find({
      where: { typeId: typeId.toString() },
      relations: [
        'user',
        'user.teacher',
        'likes',
        'likes.student',
        'comments',
        'comments.student',
      ],
    });

    // Get user's recommendation scores for these reels (no limit - get all)
    const recommendations = await this.recommendationService.getRecommendations(userId, 'reel', 1000); // Large number to get all
    
    // Create a map of contentId to recommendation score
    const recommendationMap = new Map();
    recommendations.forEach(rec => {
      recommendationMap.set(rec.contentId, rec.score);
    });

    // Add recommendation scores to reels and sort by score (highest first)
    const reelsWithScores = reels.map(reel => {
      const recommendationScore = recommendationMap.get(reel.id) || 0.5; // Default score if no recommendation
      
      return {
        id: reel.id,
        description: reel.description,
        reelPath: reel.reelPath,
        level: reel.level,
        tags: reel.tags,
        duration: reel.duration,
        typeId: reel.typeId,
        createdAt: reel.createdAt,
        // Teacher information
        user: {
          id: reel.user?.teacher?.id,
          fName: reel.user ? reel.user.fName : 'Unknown',
          lName: reel.user ? reel.user.lName : 'Unknown',
          isFollowed: false, // TODO: Implement follow logic
        },
        // Engagement metrics
        likesCount: reel.likes?.length || 0,
        commentsCount: reel.comments?.length || 0,
        // Recommendation scoring
        recommendationScore: recommendationScore,
        rank: recommendationMap.has(reel.id) ? recommendations.find(r => r.contentId === reel.id)?.rank || 999 : 999,
      };
    });

    // Sort by recommendation score (highest first), then by creation date (newest first)
    reelsWithScores.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Return ALL reels (no limit)
    return reelsWithScores;
  }

  findOneById(id: number) {
    return this.reelRepo.findOne({
      where: { id: id },
    });
  }

  async update(id: number, data: UpdateReelDto) {
    const reel = await this.findOneById(id);
    if (!reel) throw new NotFoundException('Reel Not Found');
    
    // Only allow updating description and tags
    if (data.description !== undefined) {
      reel.description = data.description;
    }
    if (data.tags !== undefined) {
      reel.tags = data.tags;
    }
    
    return this.reelRepo.save(reel);
  }

  async delete(id: number, user: any) {
    const findReel = await this.findOneById(id);
    if (!findReel) throw new NotFoundException('Reel Not Found');
    if (findReel.userId != user.id) {
      throw new ForbiddenException('You are not allowed to delete this reel');
    }
    
    // Delete the video file from uploads directory
    if (findReel.reelPath) {
      const videoFilePath = path.join('uploads', 'videos', findReel.reelPath);
      try {
        await fs.promises.unlink(videoFilePath);
        console.log(`Reel video file deleted: ${videoFilePath}`);
      } catch (error) {
        console.error(`Error deleting reel video file: ${videoFilePath}`, error);
        // Continue with database deletion even if file deletion fails
      }
    }
    
    return this.reelRepo.remove(findReel);
  }
}
