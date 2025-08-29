import { Course } from 'src/course/entities/course.entity';
import { Exam } from 'src/exam/entities/exam.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class CourseVideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column({nullable: true})
  youtubeVideoId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({nullable: true})
  thumbnail_url: string;

  @Column({nullable: true})
  path: string;

  @Column({default: false})
  approaved: boolean;

  @Column({nullable: true})
  privacyStatus: string;

  @Column({nullable: true})
  videoUrl: string;

  @Column({ default: 0 })
  number: number;

  @ManyToOne(() => Course, (type) => type.courseVideos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => Exam, (exam) => exam.video)
  exams: Exam[]; 
}
