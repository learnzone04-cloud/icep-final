import { ArticleLikeService } from './article-like.service';
export declare class ArticleLikeController {
    private readonly service;
    constructor(service: ArticleLikeService);
    toggleArticleLike(req: any, id: number): any;
    checkUserLikeStatus(req: any, id: number): any;
    getArticleLikeCount(id: number): any;
    getArticleLikeOne(id: number): Promise<import("./entity/ArticleLike").ArticleLike[]>;
    getArticleLikes(): Promise<import("./entity/ArticleLike").ArticleLike[]>;
    deleteLike(id: number): Promise<import("./entity/ArticleLike").ArticleLike>;
}
