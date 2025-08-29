import { ArticleComment } from 'src/article-comment/entity/ArticleComment';
import { ArticleLike } from 'src/article-like/entity/ArticleLike';
import { ArticleRead } from 'src/article-reed/entity/ArticleReed';
import { SavedArticle } from 'src/saved-article/entity/SavedArticle';
import { TypeEntity } from 'src/types/entity/Type';
import { UserEntity } from 'src/users/entity/User';
export declare class ArticleEntity {
    id: number;
    article: string;
    tags: string;
    level: string;
    userId: number;
    typeId: number;
    type: TypeEntity;
    user: UserEntity;
    articleLikes: ArticleLike[];
    articleComments: ArticleComment[];
    articleReads: ArticleRead[];
    savedArticles: SavedArticle[];
    createdAt: Date;
}
