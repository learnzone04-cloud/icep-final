import { ReelCommentService } from './reel-comment.service';
export declare class ReelCommentController {
    private readonly service;
    constructor(service: ReelCommentService);
    likeReel(req: any, id: number, body: {
        content: string;
    }): any;
    getReelComment(id: number): Promise<import("./entity/ReelComment").ReelCommentEntity[]>;
    deleteLike(id: number): Promise<import("./entity/ReelComment").ReelCommentEntity>;
}
