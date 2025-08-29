import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entity/User';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';

@Entity('short_video_comments')
export class ShortVideoCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => ShortVideoEntity, (shortVideo) => shortVideo.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shortVideoId' })
  shortVideo: ShortVideoEntity;

  @Column()
  shortVideoId: number;

  @ManyToOne(() => UserEntity, (user) => user.shortVideoComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column()
  studentId: string;
} 