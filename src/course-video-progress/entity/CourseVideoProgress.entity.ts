import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../student/entity/Student';
import { Course } from '../../course/entities/course.entity';
import { CourseVideoEntity } from '../../course-video/entity/course-video.entity';

@Entity()
export class CourseVideoProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  courseId: number;

  @Column()
  videoId: number;

  @Column()
  videoNumber: number;

  @Column({ default: false })
  isUnlocked: boolean;

  @Column({ default: false })
  isWatched: boolean;

  @ManyToOne(() => Student, (student) => student.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => CourseVideoEntity, (video) => video.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'videoId' })
  video: CourseVideoEntity;
} 