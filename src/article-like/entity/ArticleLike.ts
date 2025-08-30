// article-like.entity.ts
import { ArticleEntity } from 'src/article/entity/Article';
import { UserEntity } from 'src/users/entity/User';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ArticleLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isLiked: boolean;

  @Column()
  articleId: number;

  @Column()
  studentId: number;

  @ManyToOne(() => ArticleEntity, (article) => article.articleLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (student) => student.articleLikes)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;
}
