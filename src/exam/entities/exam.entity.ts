import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity';
import { ExamQuestion } from 'src/exam-question/entities/exam-question.entity';
import { ExamStudent } from '../../exam-student/exam-student.entity';

export enum ExamType {
  MidExam = "Mid Exam",
  FinalExam = "Final Exam",
  SpecificVideoExam = "Specific Video Exam",
}

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ExamType,
  })
  type: ExamType;

  @Column()
  courseId: number;

  @ManyToOne(() => Course, (course) => course.exams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  // @Column({ nullable: true })
  // videoId?: number;

  @ManyToOne(() => CourseVideoEntity, (video) => video.exams, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'videoId' })
  video?: CourseVideoEntity;

  @Column({ nullable: true })
  label?: string;

  @Column({ default: 50, update: false })
  readonly numberOfQuestions: number;

  @Column({ default: 0 })
  questionCount: number;

  @Column({ default: false })
  valid: boolean;

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.exam, { cascade: true })
  questions: ExamQuestion[];

  @OneToMany(() => ExamStudent, (examStudent) => examStudent.exam)
  examStudents: ExamStudent[];
}