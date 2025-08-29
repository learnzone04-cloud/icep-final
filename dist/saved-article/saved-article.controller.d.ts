import { SavedArticleService } from './saved-article.service';
import { SaveArticleDto } from './dto/save-article.dto';
export declare class SavedArticleController {
    private readonly savedArticleService;
    constructor(savedArticleService: SavedArticleService);
    saveArticle(saveArticleDto: SaveArticleDto, req: any): Promise<import("./entity/SavedArticle").SavedArticle>;
    unsaveArticle(articleId: number, req: any): Promise<{
        message: string;
    }>;
    getSavedArticles(req: any): Promise<{
        id: number;
        savedAt: Date;
        article: import("../article/entity/Article").ArticleEntity;
    }[]>;
    isArticleSaved(articleId: number, req: any): Promise<boolean>;
}
