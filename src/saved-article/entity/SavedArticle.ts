import { ArticleEntity } from 'src/article/entity/Article';
import { Student } from 'src/student/entity/Student';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('saved_articles')
export class SavedArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  articleId: number;



  @ManyToOne(() => Student, (student) => student.savedArticles)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => ArticleEntity, (article) => article.savedArticles)
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;

  @CreateDateColumn()
  savedAt: Date;
} 