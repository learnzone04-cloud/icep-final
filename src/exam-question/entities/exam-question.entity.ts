import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exam } from 'src/exam/entities/exam.entity';

export enum CorrectAnswerEnum {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH',
}

@Entity()
export class ExamQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  firstAnswer: string;

  @Column()
  secondAnswer: string;

  @Column()
  thirdAnswer: string;

  @Column()
  fourthAnswer: string;

  @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column({
    type: 'enum',
    enum: CorrectAnswerEnum,
  })
  correctAnswer: CorrectAnswerEnum;
}