import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { Request } from 'express';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { Repository } from 'typeorm';
export declare class StoryController {
    private readonly storyService;
    private readonly teacherRepo;
    private readonly studentRepo;
    constructor(storyService: StoryService, teacherRepo: Repository<TeacherEntity>, studentRepo: Repository<Student>);
    createStory(createStoryDto: CreateStoryDto, file: Express.Multer.File, req: Request): Promise<import("./entity/Story").Story>;
    getStoriesForStudent(req: Request): Promise<import("./entity/Story").Story[]>;
    getMyStories(req: Request): Promise<import("./entity/Story").Story[]>;
    likeStory(storyId: string, req: Request): Promise<{
        message: string;
    }>;
    getStoryLikes(storyId: string): Promise<import("./entity/StoryLike").StoryLike[]>;
    deleteStory(storyId: string, req: Request): Promise<{
        message: string;
    }>;
    cleanupExpiredStories(): Promise<{
        message: string;
    }>;
}
