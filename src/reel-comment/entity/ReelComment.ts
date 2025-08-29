import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entity/User';
import { ReelEntity } from 'src/reels/entity/Reel';

@Entity('reel_comments')
export class ReelCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  content: string;

  @ManyToOne(() => ReelEntity, (reel) => reel.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reelId' })
  reel: ReelEntity;

  @Column()
  reelId: number;

  @ManyToOne(() => UserEntity, (user) => user.reelComment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column()
  studentId: string;
}
