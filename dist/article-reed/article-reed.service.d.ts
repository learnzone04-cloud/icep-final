import { ArticleRead } from './entity/ArticleReed';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from 'src/article/article.service';
export declare class ArticleReedService {
    private articleReadRepo;
    private readonly userService;
    private readonly service;
    constructor(articleReadRepo: Repository<ArticleRead>, userService: UsersService, service: ArticleService);
    createArticleRead(data: {
        articleId: number;
        id: number;
    }): Promise<ArticleRead>;
    findArticleReed(id: number): Promise<ArticleRead[]>;
    find(): Promise<ArticleRead[]>;
    findOneById(id: number): Promise<ArticleRead>;
    delete(id: number): Promise<ArticleRead>;
}
