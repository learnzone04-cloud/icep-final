import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('rates')
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  teacherId: number;

  @Column({ type: 'int', comment: 'Rating from 1 to 5' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Student, (student) => student.rates)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.rates)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @CreateDateColumn()
  createdAt: Date;
}
