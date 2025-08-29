import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entity/User';
import { ReelEntity } from 'src/reels/entity/Reel';

@Entity('reel_likes')
export class ReelLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isLiked: boolean;

  @ManyToOne(() => ReelEntity, (reel) => reel.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reelId' })
  reel: ReelEntity;

  @Column()
  reelId: number;

  @ManyToOne(() => UserEntity, (user) => user.reelLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column()
  studentId: string;
}
