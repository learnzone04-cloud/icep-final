import { Student } from 'src/student/entity/Student';
import { TypeEntity } from 'src/types/entity/Type';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class StudentType {
  @PrimaryGeneratedColumn()
  StudentTypeId: number;

  @Column()
  typeId: number;

  @Column()
  studentId: number;

  @ManyToOne(() => TypeEntity, (type) => type.studentTypes)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @ManyToOne(() => Student, (student) => student.studentTypes)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ nullable: true })
  level: string;
}
