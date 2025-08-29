import { ShortVideoCommentService } from './short-video-comment.service';
import { CreateShortVideoCommentDto } from './dtos/create-short-video-comment.dto';
export declare class ShortVideoCommentController {
    private readonly shortVideoCommentService;
    constructor(shortVideoCommentService: ShortVideoCommentService);
    createShortVideoComment(shortVideoId: number, req: any, createShortVideoCommentDto: CreateShortVideoCommentDto): Promise<import("./entity/ShortVideoComment").ShortVideoCommentEntity>;
    getShortVideoComments(): Promise<import("./entity/ShortVideoComment").ShortVideoCommentEntity[]>;
    getCommentsForShortVideo(shortVideoId: number): Promise<import("./entity/ShortVideoComment").ShortVideoCommentEntity[]>;
    deleteShortVideoComment(id: number, req: any): Promise<import("./entity/ShortVideoComment").ShortVideoCommentEntity>;
}
