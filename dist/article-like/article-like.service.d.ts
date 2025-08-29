import { ArticleLike } from './entity/ArticleLike';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from 'src/article/article.service';
import { ArticleLikeResponseDto } from './dto/article-like-response.dto';
export declare class ArticleLikeService {
    private articleLikeRepo;
    private readonly userService;
    private readonly articleService;
    constructor(articleLikeRepo: Repository<ArticleLike>, userService: UsersService, articleService: ArticleService);
    toggleArticleLike(articleId: number, userId: number): Promise<ArticleLikeResponseDto>;
    getArticleLikeCount(articleId: number): Promise<number>;
    checkUserLikeStatus(articleId: number, userId: number): Promise<boolean>;
    find(): Promise<ArticleLike[]>;
    findArticleOneLike(id: number): Promise<ArticleLike[]>;
    findOneById(id: number): Promise<ArticleLike>;
    delete(id: number): Promise<ArticleLike>;
}
