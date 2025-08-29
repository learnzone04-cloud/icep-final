import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @Column()
  studentId: number;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.followers)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @ManyToOne(() => Student, (student) => student.followers)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
