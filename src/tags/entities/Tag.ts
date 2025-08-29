import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TypeEntity } from '../../types/entity/Type';

@Entity('tags')
@Index(['typeId', 'name']) // For fast lookups by type and name
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // grammar, vocabs, speaking, etc.

  @Column()
  typeId: number; // 1 = English, 2 = German

  @ManyToOne(() => TypeEntity, (type) => type.tags)
  @JoinColumn({ name: 'typeId' })
  type: TypeEntity;

  @CreateDateColumn()
  createdAt: Date;
}



