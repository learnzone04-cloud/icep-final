import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Student } from 'src/student/entity/Student';
import { Course } from 'src/course/entities/course.entity';

@Entity('enroll_course_student')
export class EnrollCourseStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  courseId: number;

  @CreateDateColumn()
  enrollDate: Date;

  @Column({ default: false })
  isPass: boolean;

  @Column({ type: 'float', nullable: true })
  mark: number | null;

  @ManyToOne(() => Student, (student) => student.enrollments)
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;
} 