import { ArticleComment } from 'src/article-comment/entity/ArticleComment';
import { ArticleLike } from 'src/article-like/entity/ArticleLike';
import { ArticleRead } from 'src/article-reed/entity/ArticleReed';
import { ArticleEntity } from 'src/article/entity/Article';
import { ReelCommentEntity } from 'src/reel-comment/entity/ReelComment';
import { ReelLikeEntity } from 'src/reel-like/entity/ReelLike';
import { ReelEntity } from 'src/reels/entity/Reel';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';
import { ShortVideoLikeEntity } from 'src/short-video-like/entity/ShortVideoLike';
import { ShortVideoCommentEntity } from 'src/short-video-comment/entity/ShortVideoComment';
import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import { Notification } from 'src/notification/entity/Notification';
export declare enum UserRole {
    Teacher = "Teacher",
    Student = "Student",
    Admin = "Admin"
}
export declare class UserEntity {
    id: number;
    fName: string;
    lName: string;
    phoneNumber: string;
    active: boolean;
    email: string;
    password: string;
    role: UserRole;
    teacher: TeacherEntity;
    student: Student;
    reels: ReelEntity[];
    shortVideos: ShortVideoEntity[];
    articles: ArticleEntity[];
    reelLikes: ReelLikeEntity[];
    reelComment: ReelCommentEntity[];
    shortVideoLikes: ShortVideoLikeEntity[];
    shortVideoComments: ShortVideoCommentEntity[];
    articleLikes: ArticleLike[];
    articleComments: ArticleComment[];
    articleReads: ArticleRead[];
    notifications: Notification[];
    createdAt: Date;
}
