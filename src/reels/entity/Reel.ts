import { ReelCommentEntity } from 'src/reel-comment/entity/ReelComment';
import { ReelLikeEntity } from 'src/reel-like/entity/ReelLike';
import { TypeEntity } from 'src/types/entity/Type';
import { UserEntity } from 'src/users/entity/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reels')
export class ReelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reelPath: string;

  @Column()
  description: string;

  @Column()
  tags: string;

  @Column()
  level: string;

  @Column({ default: 0 })
  duration: number; // Duration in seconds

  @Column()
  userId: string;

  @Column()
  typeId: string;

  @ManyToOne(() => TypeEntity, (type) => type.reels)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @ManyToOne(() => UserEntity, (type) => type.reels)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => ReelLikeEntity, (reel) => reel.reel)
  likes: ReelLikeEntity[];

  @OneToMany(() => ReelCommentEntity, (reel) => reel.reel)
  comments: ReelCommentEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
