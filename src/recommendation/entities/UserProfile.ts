import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  // Content level preference (A1, A2, B1, B2, C1, C2)
  @Column()
  levelPreference: string;

  // Engagement preferences
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.5 })
  averageWatchPercentage: number; // Average watch time across all videos

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.5 })
  averageScrollPercentage: number; // Average scroll depth for articles

  @Column({ default: 0 })
  followedTeachersCount: number;

  @Column({ default: 0 })
  totalInteractions: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

