import { ArticleEntity } from 'src/article/entity/Article';
import { ConversationRoom } from 'src/conversation-room/entity/ConversationRoom';
import { Course } from 'src/course/entities/course.entity';
import { ReelEntity } from 'src/reels/entity/Reel';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';
import { StudentType } from 'src/student-type/entity/StudentType';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import { Tag } from 'src/tags/entities/Tag';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('types')
export class TypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TeacherEntity, (teacher) => teacher.type)
  teachers: TeacherEntity[];

  @OneToMany(() => ReelEntity, (reel) => reel.type)
  reels: ReelEntity[];

  @OneToMany(() => ShortVideoEntity, (shortVideo) => shortVideo.type)
  shortVideos: ShortVideoEntity[];

  @OneToMany(() => StudentType, (reel) => reel.type)
  studentTypes: StudentType[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Course , (type) => type.type)
  course : Course;
  
  @OneToMany(() => ArticleEntity , (article) => article.type)
  articles : ArticleEntity[];
  
  @OneToMany(() => ConversationRoom, (room) => room.type)
  conversationRooms: ConversationRoom[];
  
  @OneToMany(() => Tag, (tag) => tag.type)
  tags: Tag[];
}
