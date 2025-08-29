import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lesson } from './Lesson';

export enum RescheduleRequestedBy {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export enum RescheduleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity()
export class LessonReschedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lessonId: number;

  @Column({
    type: 'enum',
    enum: RescheduleRequestedBy
  })
  requestedBy: RescheduleRequestedBy;

  @Column({ type: 'date' })
  oldDate: Date;

  @Column({ type: 'time' })
  oldStartTime: string;

  @Column({ type: 'date' })
  newDate: Date;

  @Column({ type: 'time' })
  newStartTime: string;

  @Column({
    type: 'enum',
    enum: RescheduleStatus,
    default: RescheduleStatus.PENDING
  })
  status: RescheduleStatus;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;
} 