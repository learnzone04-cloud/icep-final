import { ShortVideoLikeService } from './short-video-like.service';
export declare class ShortVideoLikeController {
    private readonly shortVideoLikeService;
    constructor(shortVideoLikeService: ShortVideoLikeService);
    toggleShortVideoLike(shortVideoId: number, req: any): Promise<import("./dto/short-video-like-response.dto").ShortVideoLikeResponseDto>;
    getShortVideoLikes(): Promise<import("./entity/ShortVideoLike").ShortVideoLikeEntity[]>;
    getLikesForShortVideo(shortVideoId: number): Promise<import("./entity/ShortVideoLike").ShortVideoLikeEntity[]>;
    checkUserLike(shortVideoId: number, req: any): Promise<{
        isLiked: boolean;
        likeId: number;
    }>;
    checkUserLikeStatus(shortVideoId: number, req: any): Promise<boolean>;
    getShortVideoLikeCount(shortVideoId: number): Promise<number>;
    deleteShortVideoLike(id: number): Promise<import("./entity/ShortVideoLike").ShortVideoLikeEntity>;
}
