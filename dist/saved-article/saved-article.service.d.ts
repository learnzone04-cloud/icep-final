import { Repository } from 'typeorm';
import { SavedArticle } from './entity/SavedArticle';
import { Student } from '../student/entity/Student';
import { ArticleEntity } from '../article/entity/Article';
import { SaveArticleDto } from './dto/save-article.dto';
export declare class SavedArticleService {
    private readonly savedArticleRepo;
    private readonly studentRepo;
    private readonly articleRepo;
    constructor(savedArticleRepo: Repository<SavedArticle>, studentRepo: Repository<Student>, articleRepo: Repository<ArticleEntity>);
    saveArticle(userId: number, saveArticleDto: SaveArticleDto): Promise<SavedArticle>;
    unsaveArticle(userId: number, articleId: number): Promise<{
        message: string;
    }>;
    getSavedArticles(userId: number): Promise<{
        id: number;
        savedAt: Date;
        article: ArticleEntity;
    }[]>;
    isArticleSaved(userId: number, articleId: number): Promise<boolean>;
}
