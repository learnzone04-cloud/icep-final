import { ReelLikeService } from './reel-like.service';
export declare class ReelLikeController {
    private readonly service;
    constructor(service: ReelLikeService);
    toggleReelLike(req: any, id: number): any;
    checkUserLikeStatus(req: any, id: number): any;
    getReelLikeCount(id: number): any;
    getReelLike(id: number): Promise<import("./entity/ReelLike").ReelLikeEntity[]>;
    deleteLike(id: number): Promise<import("./entity/ReelLike").ReelLikeEntity>;
}
