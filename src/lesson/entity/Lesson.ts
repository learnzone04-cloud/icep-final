import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entity/User';
import { Chat } from '../../chat/entities/chat.entity';

export enum LessonStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED'
}

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @Column()
  studentId: number;

  @Column({ type: 'date' })
  lessonDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.SCHEDULED
  })
  status: LessonStatus;

  @Column({ nullable: true })
  meetLink?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  chatId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;
} 