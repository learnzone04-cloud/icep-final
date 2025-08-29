import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { TeacherEntity } from '../../teacher/entity/Teacher';

@Entity('stories')
@Index(['teacherId', 'createdAt']) // Index for efficient queries
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @Column('text', { nullable: true })
  content: string; // For text stories or photo captions

  @Column({ nullable: true })
  mediaUrl: string; // For photo stories



  @Column({ default: false })
  isExpired: boolean; // Flag to mark expired stories

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime' })
  expiresAt: Date; // When the story expires (24 hours from creation)

  @ManyToOne(() => TeacherEntity, teacher => teacher.stories)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @OneToMany('StoryLike', 'story')
  likes: any[];

  // Virtual property to check if story is expired
  get isExpiredNow(): boolean {
    return new Date() > this.expiresAt;
  }
} 