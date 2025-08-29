import { Student } from 'src/student/entity/Student';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class NewWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  studentId: number;

  @Column({ nullable: true })
  phraseExample?: string;

  @ManyToOne(() => Student, (type) => type.words)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
