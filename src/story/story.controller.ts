import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { Request } from 'express';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  // Create a story (teachers only) - supports photo, text, or both
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/stories',
        filename: (req, file, callback) => {
          const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        callback(null, true);
      },
    }),
  )
  async createStory(
    @Body() createStoryDto: CreateStoryDto, 
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const userId = (req.user as any).id;
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Set mediaUrl if photo was uploaded
    if (file) {
      createStoryDto.mediaUrl = file.path;
    }

    // Validate that we have either photo or text content
    if (!file && !createStoryDto.content) {
      throw new Error('Must provide either a photo or text content');
    }

    return this.storyService.createStory(teacher.id, createStoryDto);
  }

  // Get stories for student (from followed teachers)
  @Get('for-student')
  async getStoriesForStudent(@Req() req: Request) {
    const userId = (req.user as any).id;
    const student = await this.studentRepo.findOne({ where: { userId } });
    
    if (!student) {
      throw new Error('Student not found');
    }

    return this.storyService.getStoriesForStudent(student.id);
  }

  // Get teacher's own stories
  @Get('my-stories')
  async getMyStories(@Req() req: Request) {
    const userId = (req.user as any).id;
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return this.storyService.getTeacherStories(teacher.id);
  }



  // Like a story
  @Post(':storyId/like')
  async likeStory(@Param('storyId') storyId: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    const student = await this.studentRepo.findOne({ where: { userId } });
    
    if (!student) {
      throw new Error('Student not found');
    }

    await this.storyService.likeStory(parseInt(storyId), student.id);
    return { message: 'Story liked successfully' };
  }



  // Get story likes
  @Get(':storyId/likes')
  async getStoryLikes(@Param('storyId') storyId: string) {
    return this.storyService.getStoryLikes(parseInt(storyId));
  }

  // Delete story (teachers only)
  @Delete(':storyId')
  async deleteStory(@Param('storyId') storyId: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    await this.storyService.deleteStory(parseInt(storyId), teacher.id);
    return { message: 'Story deleted successfully' };
  }

  // Clean up expired stories (admin endpoint)
  @Post('cleanup-expired')
  async cleanupExpiredStories() {
    await this.storyService.cleanupExpiredStories();
    return { message: 'Expired stories cleaned up successfully' };
  }
}