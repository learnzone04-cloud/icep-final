import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TeacherEntity } from 'src/teacher/entity/Teacher';

export enum CouponMode {
  PUBLIC = 'public',
}

export enum CouponScope {
  ALL_COURSES = 'all_courses',
  ALL_ROOMS = 'all_rooms',
  COURSE = 'course',
  ROOM = 'room',
}

@Entity('coupon')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.coupons)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @Column({ type: 'enum', enum: CouponMode })
  mode: CouponMode;

  @Column({ type: 'enum', enum: CouponScope })
  scope: CouponScope;

  @Column({ type: 'int', nullable: true })
  targetId?: number; // optional for specific course/room

  @Column({ type: 'int' })
  percent: number; // 1..100

  @Column({ type: 'datetime' })
  startAt: Date;

  @Column({ type: 'datetime' })
  endAt: Date;

  @Column({ type: 'int', default: 0 })
  limitTotal: number; // 0 means unlimited

  @Column({ type: 'int', default: 1 })
  limitPerStudent: number;

  @Column({ default: true })
  active: boolean;

  // For PUBLIC mode only
  @Index({ unique: true })
  @Column({ nullable: true })
  code?: string;

  @Index()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}


