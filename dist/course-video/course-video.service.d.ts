import { CourseVideoEntity } from './entity/course-video.entity';
import { Repository } from 'typeorm';
import { CourseService } from 'src/course/course.service';
import { YoutubeService } from 'src/youtube/youtube.service';
export declare class CourseVideoService {
    private repo;
    private courseService;
    private youtubeService;
    constructor(repo: Repository<CourseVideoEntity>, courseService: CourseService, youtubeService: YoutubeService);
    create(id: number, body: {
        title: string;
        description: string;
    }, path: string): Promise<CourseVideoEntity>;
    findOne(id: number): Promise<CourseVideoEntity>;
    findAllByCourseId(courseId: number): Promise<CourseVideoEntity[]>;
    approveVideo(id: number, youtubeTokens?: any): Promise<any>;
    disapproveVideo(id: number, youtubeTokens?: any): Promise<{
        success: boolean;
        message: string;
        deletedVideoId: string;
        deletedLocalId: number;
        wasApproved?: undefined;
    } | {
        success: boolean;
        message: string;
        deletedLocalId: number;
        wasApproved: boolean;
        deletedVideoId?: undefined;
    }>;
    editDescreption(id: number, body: {
        description: string;
    }): Promise<{
        description: string;
    }>;
    delete(id: number): Promise<CourseVideoEntity>;
}
