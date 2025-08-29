import { AdminAuthService } from 'src/admin-auth/admin-auth.service';
import { CourseVideoService } from './course-video.service';
export declare class CourseVideoController {
    private service;
    private adminAuthService;
    constructor(service: CourseVideoService, adminAuthService: AdminAuthService);
    addReel(req: any, id: number, video: Express.Multer.File, createTeacherDto: {
        title: string;
        description: string;
    }): any;
    approveCourse(id: number, req: any): Promise<any>;
    disapproveVideo(id: number, req: any): Promise<{
        success: boolean;
        message: string;
        user: any;
    } | {
        disapprovedBy: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
        disapprovedAt: string;
        youtubeAccess: boolean;
        success: boolean;
        message: string;
        deletedVideoId: string;
        deletedLocalId: number;
        wasApproved?: undefined;
        user?: undefined;
    } | {
        disapprovedBy: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
        disapprovedAt: string;
        youtubeAccess: boolean;
        success: boolean;
        message: string;
        deletedLocalId: number;
        wasApproved: boolean;
        deletedVideoId?: undefined;
        user?: undefined;
    }>;
    getCourseVideo(id: number): Promise<import("./entity/course-video.entity").CourseVideoEntity[]>;
    editVideoDescription(id: number, body: {
        description: string;
    }): Promise<{
        description: string;
    }>;
    deleteCourseVideo(id: number): Promise<import("./entity/course-video.entity").CourseVideoEntity>;
}
