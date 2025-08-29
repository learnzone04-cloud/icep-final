import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('user_recommendations')
@Index(['userId', 'contentType'])
@Index(['userId', 'score']) // For fast ranking
export class UserRecommendation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  contentId: number;

  @Column()
  contentType: 'reel' | 'article' | 'short_video';

  // Recommendation score (higher = better)
  @Column({ type: 'decimal', precision: 5, scale: 3 })
  score: number;

  // Rank position (1 = best, 2 = second best, etc.)
  @Column()
  rank: number;

  // Breakdown of the score for debugging
  @Column({ type: 'decimal', precision: 5, scale: 3 })
  levelScore: number; // 40% weight

  @Column({ type: 'decimal', precision: 5, scale: 3 })
  tagScore: number; // 30% weight

  @Column({ type: 'decimal', precision: 5, scale: 3 })
  teacherScore: number; // 30% weight

  @Column({ type: 'decimal', precision: 5, scale: 3 })
  engagementMultiplier: number;

  @Column({ type: 'decimal', precision: 5, scale: 3 })
  recencyFactor: number;

  // Content metadata for quick access
  @Column()
  contentLevel: string; // A1, A2, B1, etc.

  @Column()
  teacherId: number;

  @Column()
  isTeacherFollowed: boolean;

  // Cache management
  @CreateDateColumn()
  cachedAt: Date;

  // Expiration for cache refresh
  @Column()
  expiresAt: Date;
}

