import { ArticleEntity } from 'src/article/entity/Article';
import { UserEntity } from 'src/users/entity/User';
export declare class ArticleRead {
    id: number;
    articleId: number;
    studentId: number;
    article: ArticleEntity;
    student: UserEntity;
}
