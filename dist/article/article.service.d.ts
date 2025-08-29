import { ArticleEntity } from './entity/Article';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RecommendationService } from 'src/recommendation/services/recommendation.service';
export declare class ArticleService {
    private articleRepo;
    private readonly userService;
    private readonly notificationService;
    private readonly recommendationService;
    constructor(articleRepo: Repository<ArticleEntity>, userService: UsersService, notificationService: NotificationService, recommendationService: RecommendationService);
    createArticle(id: number, data: CreateArticleDto): Promise<ArticleEntity>;
    find(): Promise<ArticleEntity[]>;
    findByUserType(user: any): Promise<ArticleEntity[]>;
    findArticlesWithRecommendations(userId: number, userTypeId: number): Promise<{
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
    findOneById(id: number): Promise<ArticleEntity>;
    delete(id: number): Promise<ArticleEntity>;
    update(id: number, data: UpdateArticleDto): Promise<ArticleEntity>;
}
