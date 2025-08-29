import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ConversationRoom } from './ConversationRoom';
import { Student } from '../../student/entity/Student';

@Entity()
export class ConversationRoomParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConversationRoom, room => room.participants)
  room: ConversationRoom;

  @ManyToOne(() => Student, student => student.conversationRoomParticipations, { eager: true })
  student: Student;

  @Column({ default: false })
  paid: boolean;

  @Column({ type: 'datetime', nullable: true })
  joinedAt: Date;
} 