import { ArticleComment } from './entity/ArticleComment';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from 'src/article/article.service';
export declare class ArticleCommentService {
    private articleCommentRepo;
    private readonly userService;
    private readonly service;
    constructor(articleCommentRepo: Repository<ArticleComment>, userService: UsersService, service: ArticleService);
    createArticleComment(articleId: number, id: number, data: {
        content: string;
    }): Promise<ArticleComment>;
    find(): Promise<ArticleComment[]>;
    findArticleOneComment(id: number): Promise<ArticleComment[]>;
    findOneById(id: number): Promise<ArticleComment>;
    delete(id: number): Promise<ArticleComment>;
}
