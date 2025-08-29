import { ArticleReedService } from './article-reed.service';
export declare class ArticleReedController {
    private readonly service;
    constructor(service: ArticleReedService);
    readArticle(req: any, id: number): any;
    getArticleReadOne(id: number): Promise<import("./entity/ArticleReed").ArticleRead[]>;
    getArticleReads(): Promise<import("./entity/ArticleReed").ArticleRead[]>;
    deleteLike(id: number): Promise<import("./entity/ArticleReed").ArticleRead>;
}
