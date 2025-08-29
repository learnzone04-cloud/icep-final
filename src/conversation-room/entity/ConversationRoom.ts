import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PlacementLevel } from '../../placement-test/placement-test.entity';
import { TeacherEntity as Teacher } from '../../teacher/entity/Teacher';
import { ConversationRoomParticipant } from './ConversationRoomParticipant';
import { TypeEntity } from 'src/types/entity/Type';

export enum ConversationRoomStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class ConversationRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'simple-array' })
  level: PlacementLevel[];

  @Column({ type: 'varchar', nullable: true })
  tags: string;

  @Column('float')
  price: number;

  @Column({ default: 'usd' })
  currency: string;

  @Column()
  typeId: number;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'int', default: 15 })
  maxStudents: number;

  @Column({ type: 'enum', enum: ConversationRoomStatus, default: ConversationRoomStatus.SCHEDULED })
  status: ConversationRoomStatus;

  @Column({ type: 'datetime', nullable: true })
  teacherJoinedAt: Date;

  @ManyToOne(() => Teacher, teacher => teacher.conversationRooms, { eager: true })
  teacher: Teacher;

  @OneToMany(() => ConversationRoomParticipant, participant => participant.room)
  participants: ConversationRoomParticipant[];

  @ManyToOne(() => TypeEntity, (type) => type.conversationRooms)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;
} 