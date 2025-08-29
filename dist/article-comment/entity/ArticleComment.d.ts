import { ArticleEntity } from 'src/article/entity/Article';
import { UserEntity } from 'src/users/entity/User';
export declare class ArticleComment {
    id: number;
    content: string;
    studentId: number;
    articleId: number;
    student: UserEntity;
    article: ArticleEntity;
}
