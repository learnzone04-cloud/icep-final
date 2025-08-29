import { YoutubeService } from './youtube.service';
import { Response } from 'express';
export declare class YoutubeController {
    private readonly youtubeService;
    constructor(youtubeService: YoutubeService);
    googleCallback(code: string, res: Response): Promise<void>;
    uploadVideo(file: Express.Multer.File, body: {
        title: string;
        description: string;
    }): Promise<any>;
    googleAuth(res: Response): void;
    uploadPage(): {
        message: string;
    };
}
