import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entity/User';

export enum NotificationType {
  ROOM_CREATED = 'room_created',
  ROOM_ENROLLMENT = 'room_enrollment',
  ROOM_STARTING = 'room_starting',
  ROOM_CANCELLED = 'room_cancelled',
  ROOM_COMPLETED = 'room_completed',
  MESSAGE_RECEIVED = 'message_received',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  REEL_CREATED = 'reel_created',
  ARTICLE_CREATED = 'article_created',
  SHORT_VIDEO_CREATED = 'short_video_created',
  COURSE_CREATED = 'course_created'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column('json', { nullable: true })
  data: any; // Additional data like roomId, teacherId, etc.

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD
  })
  status: NotificationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, user => user.notifications)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
} 