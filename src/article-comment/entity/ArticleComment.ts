// article-comment.entity.ts
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
export class ArticleComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  studentId: number;

  @Column()
  articleId: number;

  @ManyToOne(() => UserEntity, (student) => student.articleComments)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.articleComments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;
}
