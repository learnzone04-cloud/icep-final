// article-read.entity.ts
import { ArticleEntity } from 'src/article/entity/Article';
import { UserEntity } from 'src/users/entity/User';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ArticleRead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleId: number;

  @Column()
  studentId: number;

  @ManyToOne(() => ArticleEntity, (article) => article.articleReads, { onDelete: 'CASCADE' })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (student) => student.articleReads)
  student: UserEntity;
}
