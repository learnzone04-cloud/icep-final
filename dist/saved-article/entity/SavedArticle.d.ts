import { ArticleEntity } from 'src/article/entity/Article';
import { Student } from 'src/student/entity/Student';
export declare class SavedArticle {
    id: number;
    studentId: number;
    articleId: number;
    student: Student;
    article: ArticleEntity;
    savedAt: Date;
}
