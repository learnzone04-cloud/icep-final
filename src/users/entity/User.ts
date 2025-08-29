import { Exclude } from 'class-transformer';
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
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
  Admin = 'Admin',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fName: string;

  @Column()
  lName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: true })
  active: boolean;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Student })
  role: UserRole;

  @OneToOne(() => TeacherEntity, (teacher) => teacher.user, { nullable: true })
  teacher: TeacherEntity;

  @OneToOne(() => Student, (teacher) => teacher.user, { nullable: true })
  student: Student;

  @OneToMany(() => ReelEntity, (reel) => reel.user)
  reels: ReelEntity[];
  
  @OneToMany(() => ShortVideoEntity, (shortVideo) => shortVideo.teacher)
  shortVideos: ShortVideoEntity[];
  
  @OneToMany(() => ArticleEntity , (article) => article.user)
  articles: ArticleEntity[];

  @OneToMany(() => ReelLikeEntity, (reel) => reel.student)
  reelLikes: ReelLikeEntity[];

  @OneToMany(() => ReelCommentEntity, (reel) => reel.student)
  reelComment: ReelCommentEntity[];

  @OneToMany(() => ShortVideoLikeEntity, (shortVideo) => shortVideo.student)
  shortVideoLikes: ShortVideoLikeEntity[];

  @OneToMany(() => ShortVideoCommentEntity, (shortVideo) => shortVideo.student)
  shortVideoComments: ShortVideoCommentEntity[];

  @OneToMany(() => ArticleLike, (article) => article.student)
  articleLikes: ArticleLike[];

  @OneToMany(() => ArticleComment, (article) => article.student)
  articleComments: ArticleComment[];

  @OneToMany(() => ArticleRead, (article) => article.student)
  articleReads: ArticleRead[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;
}
