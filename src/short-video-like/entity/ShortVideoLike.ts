import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entity/User';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';

@Entity('short_video_likes')
export class ShortVideoLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isLiked: boolean;

  @ManyToOne(() => ShortVideoEntity, (shortVideo) => shortVideo.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shortVideoId' })
  shortVideo: ShortVideoEntity;

  @Column()
  shortVideoId: number;

  @ManyToOne(() => UserEntity, (user) => user.shortVideoLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column()
  studentId: string;
} 