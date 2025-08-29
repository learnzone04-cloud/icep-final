import { Repository } from 'typeorm';
import { UserEntity } from '../users/entity/User';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { ReelEntity } from '../reels/entity/Reel';
import { ArticleEntity } from '../article/entity/Article';
import { ShortVideoEntity } from '../short-video/entity/ShortVideo';
import { Course } from '../course/entities/course.entity';
import { EnrollCourseStudent } from '../enroll-course-student/entity/EnrollCourseStudent.entity';
export declare class StatisticsController {
    private userRepo;
    private teacherRepo;
    private reelRepo;
    private articleRepo;
    private shortVideoRepo;
    private courseRepo;
    private enrollRepo;
    constructor(userRepo: Repository<UserEntity>, teacherRepo: Repository<TeacherEntity>, reelRepo: Repository<ReelEntity>, articleRepo: Repository<ArticleEntity>, shortVideoRepo: Repository<ShortVideoEntity>, courseRepo: Repository<Course>, enrollRepo: Repository<EnrollCourseStudent>);
    getStudentsThisMonth(): Promise<{
        count: number;
    }>;
    getTeachersThisMonth(): Promise<{
        count: number;
    }>;
    getReelsThisMonth(): Promise<{
        count: number;
    }>;
    getArticlesThisMonth(): Promise<{
        count: number;
    }>;
    getShortVideosThisMonth(): Promise<{
        count: number;
    }>;
    getTopCourses(): Promise<{
        course: Course;
        enrollCount: number;
    }[]>;
    getMonthlyStudents(): Promise<{
        year: number;
        monthlyData: any[];
    }>;
    getMonthlyTeachers(): Promise<{
        year: number;
        monthlyData: any[];
    }>;
    getMonthlyReels(): Promise<{
        year: number;
        monthlyData: any[];
    }>;
    getMonthlyArticles(): Promise<{
        year: number;
        monthlyData: any[];
    }>;
    getMonthlyShortVideos(): Promise<{
        year: number;
        monthlyData: any[];
    }>;
    getAllMonthlyStatistics(): Promise<{
        year: number;
        students: any[];
        teachers: any[];
        reels: any[];
        articles: any[];
        shortVideos: any[];
    }>;
}
