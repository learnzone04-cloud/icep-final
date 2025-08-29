import { ArticleService } from './article.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
export declare class ArticleController {
    private readonly service;
    constructor(service: ArticleService);
    addArticle(req: any, body: CreateArticleDto): any;
    getArticles(req: any): Promise<import("./entity/Article").ArticleEntity[]>;
    getArticlesWithRecommendations(req: any): Promise<{
        id: number;
        article: string;
        level: string;
        tags: string;
        userId: number;
        typeId: number;
        createdAt: Date;
        user: import("../users/entity/User").UserEntity;
        articleLikes: import("../article-like/entity/ArticleLike").ArticleLike[];
        articleComments: import("../article-comment/entity/ArticleComment").ArticleComment[];
        articleReads: import("../article-reed/entity/ArticleReed").ArticleRead[];
        recommendationScore: any;
        rank: number;
    }[]>;
    deleteArticle(id: number): Promise<import("./entity/Article").ArticleEntity>;
    updateArticle(id: number, body: UpdateArticleDto): Promise<import("./entity/Article").ArticleEntity>;
}
