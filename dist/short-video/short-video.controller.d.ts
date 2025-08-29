import { ShortVideoService } from './short-video.service';
import { CreateShortVideoDto } from './dtos/create-short-video.dto';
import { Response, Request } from 'express';
import { UpdateShortVideoDto } from './dtos/update-short-video.dto';
export declare class ShortVideoController {
    private readonly shortVideoService;
    constructor(shortVideoService: ShortVideoService);
    addShortVideo(req: any, video: Express.Multer.File, createShortVideoDto: CreateShortVideoDto): any;
    streamVideo(filename: string, req: Request, res: Response): Promise<void>;
    getShortVideos(req: any): Promise<import("./entity/ShortVideo").ShortVideoEntity[]>;
    getShortVideosWithRecommendations(req: any): Promise<{
        id: number;
        description: string;
        videoPath: string;
        level: string;
        tags: string;
        duration: number;
        typeId: string;
        createdAt: Date;
        teacher: {
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
    deleteShortVideo(id: number, req: any): Promise<import("./entity/ShortVideo").ShortVideoEntity>;
    updateShortVideo(id: number, body: UpdateShortVideoDto, req: any): Promise<import("./entity/ShortVideo").ShortVideoEntity>;
}
