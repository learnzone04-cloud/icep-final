import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherEntity } from '../../teacher/entity/Teacher';

@Entity()
export class CertificateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  certificate: string;

  @Column()
  teacherId: number;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.certificate)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;
}
