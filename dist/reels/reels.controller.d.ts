import { ReelsService } from './reels.service';
import { CreateReelDto } from './dtos/create-reel.dto';
import { Response, Request } from 'express';
import { UpdateReelDto } from './dtos/update-reel.dto';
export declare class ReelsController {
    private readonly reelService;
    constructor(reelService: ReelsService);
    addReel(req: any, video: Express.Multer.File, createTeacherDto: CreateReelDto): any;
    streamVideo(filename: string, req: Request, res: Response): Promise<void>;
    getReel(req: any): Promise<import("./entity/Reel").ReelEntity[]>;
    getReelsWithRecommendations(req: any): Promise<{
        id: number;
        description: string;
        reelPath: string;
        level: string;
        tags: string;
        duration: number;
        typeId: string;
        createdAt: Date;
        user: {
            id: number;
            fName: string;
            lName: string;
            isFollowed: boolean;
        };
        likesCount: number;
        commentsCount: number;
        recommendationScore: any;
        rank: number;
    }[]>;
    deleteReel(id: number, req: any): Promise<import("./entity/Reel").ReelEntity>;
    updateReel(id: number, body: UpdateReelDto): Promise<import("./entity/Reel").ReelEntity>;
}
