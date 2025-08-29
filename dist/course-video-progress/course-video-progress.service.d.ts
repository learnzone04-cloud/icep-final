import { Repository } from 'typeorm';
import { CourseVideoProgress } from './entity/CourseVideoProgress.entity';
import { Student } from '../student/entity/Student';
import { Course } from '../course/entities/course.entity';
import { CourseVideoEntity } from '../course-video/entity/course-video.entity';
export declare class CourseVideoProgressService {
    private readonly progressRepo;
    private readonly studentRepo;
    private readonly courseRepo;
    private readonly videoRepo;
    constructor(progressRepo: Repository<CourseVideoProgress>, studentRepo: Repository<Student>, courseRepo: Repository<Course>, videoRepo: Repository<CourseVideoEntity>);
    initializeProgress(userId: number, courseId: number): Promise<void>;
    unlockNext(userId: number, courseId: number, videoId: number): Promise<{
        message: string;
    }>;
    getProgress(userId: number, courseId: number): Promise<CourseVideoProgress[]>;
    lockAllExceptFirst(studentId: number, courseId: number): Promise<void>;
}
