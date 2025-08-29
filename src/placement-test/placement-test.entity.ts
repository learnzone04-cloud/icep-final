import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PlacementLevel {
  '1A' = '1A',
  '1B' = '1B',
  '2A' = '2A',
  '2B' = '2B',
  '3A' = '3A',
  '3B' = '3B',
  '4A' = '4A',
  '4B' = '4B',
  '5A' = '5A',
  '5B' = '5B',
  'A1' = 'A1',
  'A2' = 'A2',
  'B1' = 'B1',
  'B2' = 'B2',
  'C1' = 'C1',
  'C2' = 'C2',
}

@Entity()
export class PlacementTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column('float')
  mark: number;

  @Column({ type: 'varchar', length: 10 })
  level: string;
}
