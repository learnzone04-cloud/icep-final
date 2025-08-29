import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('user_interactions')
@Index(['userId', 'contentId', 'contentType'])
@Index(['timestamp']) // For cleanup jobs
export class UserInteraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  contentId: number;

  @Column()
  contentType: 'reel' | 'article' | 'short_video';

  // Video/Reel specific metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  watchTime: number; // in seconds

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalTime: number; // in seconds

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  watchPercentage: number; // 0-100

  // Article specific metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  scrollPercentage: number; // 0-100

  // General engagement metrics
  @Column({ default: false })
  liked: boolean;

  @Column({ default: false })
  commented: boolean;

  @Column({ default: false })
  followed: boolean;

  @Column({ default: false })
  shared: boolean;

  @Column({ default: false })
  saved: boolean;

  @CreateDateColumn()
  timestamp: Date;
}

