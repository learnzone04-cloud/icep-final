import { ArticleComment } from 'src/article-comment/entity/ArticleComment';
import { ArticleLike } from 'src/article-like/entity/ArticleLike';
import { ArticleRead } from 'src/article-reed/entity/ArticleReed';
import { SavedArticle } from 'src/saved-article/entity/SavedArticle';
import { TypeEntity } from 'src/types/entity/Type';
import { UserEntity } from 'src/users/entity/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article: string;

  @Column()
  tags: string;

  @Column()
  level: string;

  @Column()
  userId: number;

  @Column()
  typeId: number;

  @ManyToOne(() => TypeEntity, (type) => type.articles)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @ManyToOne(() => UserEntity, (type) => type.articles)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => ArticleLike, (like) => like.article)
  articleLikes: ArticleLike[];

  @OneToMany(() => ArticleComment, (comment) => comment.article)
  articleComments: ArticleComment[];

  @OneToMany(() => ArticleRead, (read) => read.article)
  articleReads: ArticleRead[];

  @OneToMany(() => SavedArticle, (savedArticle) => savedArticle.article)
  savedArticles: SavedArticle[];

  @CreateDateColumn()
  createdAt: Date;
}
