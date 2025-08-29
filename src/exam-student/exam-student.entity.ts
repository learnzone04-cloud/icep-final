import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exam } from '../exam/entities/exam.entity';
import { Student } from '../student/entity/Student';

@Entity()
export class ExamStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  examId: number;

  @Column()
  studentId: number;

  @Column()
  courseId: number;

  @Column({ type: 'float', nullable: true })
  mark: number | null;

  @Column({ nullable: true })
  examType?: string;

  @ManyToOne(() => Exam, (exam) => exam.examStudents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @ManyToOne(() => Student, (student) => student.examStudents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
} 