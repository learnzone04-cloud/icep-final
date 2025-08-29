import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortVideoEntity } from './entity/ShortVideo';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateShortVideoDto } from './dtos/create-short-video.dto';
import { UpdateShortVideoDto } from './dtos/update-short-video.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RecommendationService } from 'src/recommendation/services/recommendation.service';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class ShortVideoService {
  constructor(
    @InjectRepository(ShortVideoEntity)
    private shortVideoRepo: Repository<ShortVideoEntity>,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationService,
    private readonly recommendationService: RecommendationService,
  ) {}

  async createShortVideo(id: number, data: CreateShortVideoDto, videoFile?: Express.Multer.File) {
    const user = await this.userService.findOneById(id);
    
    // Check if user is a teacher and has teacher data
    if (!user.teacher) {
      throw new NotFoundException('Only teachers can create short videos');
    }
    
    if (!user.teacher.type) {
      throw new NotFoundException('Teacher must have a type assigned');
    }
    
    const shortVideo = this.shortVideoRepo.create(data);
    shortVideo.type = user.teacher.type;
    shortVideo.teacher = user;
    
    // Extract duration from video file if provided
    if (videoFile) {
      const duration = await this.getVideoDuration(videoFile.filename);
      shortVideo.duration = duration;
      
      // Only validate duration if FFmpeg is available and duration was extracted
      if (duration !== 180) { // If duration was successfully extracted
        if (duration < 120 || duration > 240) {
          throw new ForbiddenException('Video duration must be between 2 and 4 minutes');
        }
      }
    } else {
      shortVideo.duration = 180; // Default fallback
    }
    
    const savedShortVideo = await this.shortVideoRepo.save(shortVideo);
    
    // Send notification to followers
    try {
      const teacherName = `${user.fName} ${user.lName}`;
      await this.notificationService.sendShortVideoCreatedNotification(
        user.teacher.id,
        teacherName,
        savedShortVideo.id,
        savedShortVideo.description
      );
    } catch (error) {
      console.error('Failed to send short video notification:', error);
      // Don't fail the short video creation if notification fails
    }
    
    return savedShortVideo;
  }

  private async getVideoDuration(filename: string): Promise<number> {
    const execAsync = promisify(exec);
    const videoPath = path.join('uploads', 'short-videos', filename);
    
    try {
      // Try to use ffprobe first
      const { stdout } = await execAsync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`);
      const duration = parseFloat(stdout.trim());
      
      if (isNaN(duration)) {
        throw new Error('Could not extract video duration');
      }
      
      return Math.round(duration); // Return duration in seconds
    } catch (error) {
      console.error('Error extracting video duration:', error);
      
      // Fallback: Use a default duration and allow manual update
      console.log('FFmpeg not available. Using default duration. Duration can be updated manually.');
      return 180; // Default 3 minutes
    }
  }

  find() {
    return this.shortVideoRepo.find({
      relations: [
        'teacher',
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
      console.log('Filtering short videos for student with typeId:', user.typeId);
      const shortVideos = await this.shortVideoRepo.find({
        where: { typeId: user.typeId },
        relations: [
          'teacher',
          'likes',
          'likes.student',
          'comments',
          'comments.student',
        ],
      });
      console.log('Found short videos for student:', shortVideos.map(v => ({ id: v.id, typeId: v.typeId, description: v.description })));
      return shortVideos;
    }
    
    // If user is a teacher, return only their short videos
    if (user.role === 'Teacher') {
      console.log('Filtering short videos for teacher with userId:', user.id);
      const shortVideos = await this.shortVideoRepo.find({
        where: { teacherId: user.id },
        relations: [
          'teacher',
          'likes',
          'likes.student',
          'comments',
          'comments.student',
        ],
      });
      console.log('Found teacher short videos:', shortVideos.map(v => ({ id: v.id, teacherId: v.teacherId, description: v.description })));
      return shortVideos;
    }
    
    // If no valid role or other cases, return empty array
    console.log('No valid role found, returning empty array');
    return [];
  }

  // New method: Get short videos with recommendation scoring for students
  async findShortVideosWithRecommendations(userId: number, userTypeId: number) {
    // Get all available short videos for the user's type
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

    // Get short videos filtered by user type - THIS IS CRUCIAL!
    const shortVideos = await this.shortVideoRepo.find({
      where: { typeId: typeId.toString() },
      relations: [
        'teacher',
        'teacher.teacher',
        'likes',
        'likes.student',
        'comments',
        'comments.student',
      ],
    });

    // Get user's recommendation scores for these short videos (no limit - get all)
    const recommendations = await this.recommendationService.getRecommendations(userId, 'short_video', 1000); // Large number to get all
    
    // Create a map of contentId to recommendation score
    const recommendationMap = new Map();
    recommendations.forEach(rec => {
      recommendationMap.set(rec.contentId, rec.score);
    });

    // Add recommendation scores to short videos and sort by score (highest first)
    const shortVideosWithScores = shortVideos.map(shortVideo => {
      const recommendationScore = recommendationMap.get(shortVideo.id) || 0.5; // Default score if no recommendation
      
      return {
        id: shortVideo.id,
        description: shortVideo.description,
        videoPath: shortVideo.videoPath,
        level: shortVideo.level,
        tags: shortVideo.tags,
        duration: shortVideo.duration,
        typeId: shortVideo.typeId,
        createdAt: shortVideo.createdAt,
        // Teacher information
        teacher: {
          id: shortVideo.teacher?.teacher?.id,
          fName: shortVideo.teacher ? shortVideo.teacher.fName : 'Unknown',
          lName: shortVideo.teacher ? shortVideo.teacher.lName : 'Unknown',
          isFollowed: false, // TODO: Implement follow logic
        },
        // Engagement metrics
        likesCount: shortVideo.likes?.length || 0,
        commentsCount: shortVideo.comments?.length || 0,
        // Recommendation scoring
        recommendationScore: recommendationScore,
        rank: recommendationMap.has(shortVideo.id) ? recommendations.find(r => r.contentId === shortVideo.id)?.rank || 999 : 999,
      };
    });

    // Sort by recommendation score (highest first), then by creation date (newest first)
    shortVideosWithScores.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Return ALL short videos (no limit)
    return shortVideosWithScores;
  }

  findOneById(id: number) {
    return this.shortVideoRepo.findOne({
      where: { id: id },
    });
  }

  async update(id: number, data: UpdateShortVideoDto, user: any) {
    const shortVideo = await this.findOneById(id);
    if (!shortVideo) throw new NotFoundException('Short Video Not Found');
    
    // Only the teacher who created the short video can update it
    if (shortVideo.teacherId !== user.id) {
      throw new ForbiddenException('You are not allowed to update this short video');
    }
    
    // Only allow updating description and tags
    if (data.description !== undefined) {
      shortVideo.description = data.description;
    }
    if (data.tags !== undefined) {
      shortVideo.tags = data.tags;
    }
    
    // Prevent updating other fields
    if (data.duration !== undefined || data.typeId !== undefined) {
      throw new ForbiddenException('Only description and tags can be updated');
    }
    
    return this.shortVideoRepo.save(shortVideo);
  }

  async delete(id: number, user: any) {
    const findShortVideo = await this.findOneById(id);
    if (!findShortVideo) throw new NotFoundException('Short Video Not Found');
    if (findShortVideo.teacherId != user.id) {
      throw new ForbiddenException('You are not allowed to delete this short video');
    }
    
    // Delete the video file from uploads directory
    if (findShortVideo.videoPath) {
      const videoFilePath = path.join('uploads', 'short-videos', findShortVideo.videoPath);
      try {
        await fs.promises.unlink(videoFilePath);
        console.log(`Video file deleted: ${videoFilePath}`);
      } catch (error) {
        console.error(`Error deleting video file: ${videoFilePath}`, error);
        // Continue with database deletion even if file deletion fails
      }
    }
    
    return this.shortVideoRepo.remove(findShortVideo);
  }
} 