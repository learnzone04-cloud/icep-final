import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_tag_preferences')
@Index(['userId', 'tagId']) // For fast lookups
export class UserTagPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tagId: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.5 })
  score: number; // 0.0 to 1.0 - how much user likes this tag

  @Column({ default: 0 })
  interactionCount: number; // How many times user interacted with this tag

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



