import { CourseVideoProgressService } from './course-video-progress.service';
export declare class CourseVideoProgressController {
    private readonly progressService;
    constructor(progressService: CourseVideoProgressService);
    getProgress(courseId: number, req: any): Promise<import("./entity/CourseVideoProgress.entity").CourseVideoProgress[]>;
    unlockNext(videoId: number, req: any): Promise<{
        message: string;
    }>;
}
