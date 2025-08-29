import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../student/entity/Student';
import { TeacherEntity } from '../../teacher/entity/Teacher';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => TeacherEntity, { nullable: false })
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 