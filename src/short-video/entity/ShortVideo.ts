import { ShortVideoCommentEntity } from 'src/short-video-comment/entity/ShortVideoComment';
import { ShortVideoLikeEntity } from 'src/short-video-like/entity/ShortVideoLike';
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

@Entity('short_videos')
export class ShortVideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoPath: string;

  @Column()
  description: string;

  @Column()
  tags: string;

  @Column()
  level: string;

  @Column()
  duration: number; // Duration in seconds

  @Column()
  teacherId: string; // Teacher who created the video

  @Column()
  typeId: string;

  @ManyToOne(() => TypeEntity, (type) => type.shortVideos)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @ManyToOne(() => UserEntity, (user) => user.shortVideos)
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @OneToMany(() => ShortVideoLikeEntity, (like) => like.shortVideo)
  likes: ShortVideoLikeEntity[];

  @OneToMany(() => ShortVideoCommentEntity, (comment) => comment.shortVideo)
  comments: ShortVideoCommentEntity[];

  @CreateDateColumn()
  createdAt: Date;
} 