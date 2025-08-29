import { ArticleCommentService } from './article-comment.service';
export declare class ArticleCommentController {
    private readonly service;
    constructor(service: ArticleCommentService);
    commentArticle(req: any, id: number, body: {
        content: string;
    }): any;
    getArticleComments(): Promise<import("./entity/ArticleComment").ArticleComment[]>;
    getArtcleOneLike(id: number): Promise<import("./entity/ArticleComment").ArticleComment[]>;
    deleteLike(id: number): Promise<import("./entity/ArticleComment").ArticleComment>;
}
