import { Repository } from 'typeorm';
import { Story } from './entity/Story';
import { StoryLike } from './entity/StoryLike';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { Follower } from '../follower/entities/follower.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryGateway } from './story.gateway';
import { FollowerService } from '../follower/follower.service';
export declare class StoryService {
    private readonly storyRepo;
    private readonly storyLikeRepo;
    private readonly teacherRepo;
    private readonly studentRepo;
    private readonly followerRepo;
    private readonly storyGateway;
    private readonly followerService;
    constructor(storyRepo: Repository<Story>, storyLikeRepo: Repository<StoryLike>, teacherRepo: Repository<TeacherEntity>, studentRepo: Repository<Student>, followerRepo: Repository<Follower>, storyGateway: StoryGateway, followerService: FollowerService);
    createStory(teacherId: number, createStoryDto: CreateStoryDto): Promise<Story>;
    getStoriesForStudent(studentId: number): Promise<Story[]>;
    getTeacherStories(teacherId: number): Promise<Story[]>;
    likeStory(storyId: number, studentId: number): Promise<void>;
    deleteStory(storyId: number, teacherId: number): Promise<void>;
    getStoryLikes(storyId: number): Promise<StoryLike[]>;
    cleanupExpiredStories(): Promise<void>;
}
