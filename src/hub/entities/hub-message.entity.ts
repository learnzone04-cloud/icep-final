import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { TypeEntity } from '../../types/entity/Type';
import { UserEntity } from '../../users/entity/User';

@Entity()
export class HubMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: false })
  badword: boolean;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  sender: UserEntity;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => TypeEntity, { eager: true, nullable: false })
  type: TypeEntity;
}
