import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, { nullable: false })
  chat: Chat;

  @Column()
  senderId: number;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
} 