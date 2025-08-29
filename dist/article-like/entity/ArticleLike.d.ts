import { ArticleEntity } from 'src/article/entity/Article';
import { UserEntity } from 'src/users/entity/User';
export declare class ArticleLike {
    id: number;
    isLiked: boolean;
    articleId: number;
    studentId: number;
    article: ArticleEntity;
    student: UserEntity;
}
