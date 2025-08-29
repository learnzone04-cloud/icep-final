import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import { TypeEntity } from 'src/types/entity/Type';
import { Exam } from 'src/exam/entities/exam.entity';
import { EnrollCourseStudent } from 'src/enroll-course-student/entity/EnrollCourseStudent.entity';
import { PlacementLevel } from '../../placement-test/placement-test.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @Column()
  typeId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  tags: string;

  @Column()
  duration: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  videosNumber: number;

  @Column({ default: 'usd', update: false })
  readonly currency: string;

  @Column({ default: 0 })
  examCount: number;

  @Column({ default: 100 })
  maxGrade: number;

  @Column({ nullable: true })
  passGrade: number;

  @Column({ default: false })
  hasPassFailSystem: boolean;

  @Column({
    type: 'enum',
    enum: PlacementLevel,
    nullable: true,
  })
  level: PlacementLevel;

  @ManyToOne(() => TeacherEntity, (type) => type.course)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @ManyToOne(() => TypeEntity, (type) => type.course)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @OneToMany(() => CourseVideoEntity, (type) => type.courseId)
  courseVideos: CourseVideoEntity;

  @OneToMany(() => Exam, (exam) => exam.course)
  exams: Exam[];

  @OneToMany(() => EnrollCourseStudent, (enrollment) => enrollment.course)
  enrollments: EnrollCourseStudent[];
}
