import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TeacherEntity } from 'src/teacher/entity/Teacher';

export enum DiscountScope {
  ALL_COURSES = 'all_courses',
  ALL_ROOMS = 'all_rooms',
  COURSE = 'course',
  ROOM = 'room',
}

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.discounts)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @Column({ type: 'enum', enum: DiscountScope })
  scope: DiscountScope;

  @Column({ type: 'int', nullable: true })
  targetId?: number; // set only for COURSE or ROOM scopes

  @Column({ type: 'int' })
  percent: number; // 1..100

  @Column({ type: 'datetime' })
  startAt: Date;

  @Column({ type: 'datetime' })
  endAt: Date;

  @Column({ default: true })
  active: boolean;

  @Index()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}


