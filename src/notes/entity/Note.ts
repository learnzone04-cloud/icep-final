import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Student } from 'src/student/entity/Student';
import { NoteContext } from './NoteContext';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  title: string;

  @ManyToOne(() => Student, (student) => student.notes)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @OneToMany(() => NoteContext, (noteContext) => noteContext.note)
  noteContexts: NoteContext[];
} 