import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Story } from './Story';
import { Student } from '../../student/entity/Student';

@Entity('story_likes')
export class StoryLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storyId: number;

  @Column()
  studentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Story, story => story.likes)
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @ManyToOne(() => Student, student => student.storyLikes)
  @JoinColumn({ name: 'studentId' })
  student: Student;
} 