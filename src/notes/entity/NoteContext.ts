import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Note } from './Note';

@Entity()
export class NoteContext {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  noteId: number;

  @ManyToOne(() => Note, (note) => note.noteContexts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'noteId' })
  note: Note;

  @Column('text')
  context: string;

  @Column({ nullable: true })
  videoId: number;
} 