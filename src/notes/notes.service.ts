import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entity/Note';
import { NoteContext } from './entity/NoteContext';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    @InjectRepository(NoteContext) private noteContextRepo: Repository<NoteContext>,
  ) {}

  async createNote(studentId: number, title: string = 'initial note') {
    const note = this.noteRepo.create({ studentId, title });
    return this.noteRepo.save(note);
  }

  async createNoteContext(noteId: number, context: string, videoId?: number) {
    const noteContext = this.noteContextRepo.create({ noteId, context, videoId });
    return this.noteContextRepo.save(noteContext);
  }

  async getNotesForStudent(studentId: number) {
    return this.noteRepo.find({
      where: { studentId },
      relations: ['noteContexts'],
    });
  }

  async deleteNote(noteId: number) {
    // Will cascade delete contexts if set up in entity
    return this.noteRepo.delete(noteId);
  }

  async editNote(noteId: number, title: string) {
    await this.noteRepo.update(noteId, { title });
    return this.noteRepo.findOne({ where: { id: noteId }, relations: ['noteContexts'] });
  }

  async editNoteContext(contextId: number, context: string) {
    await this.noteContextRepo.update(contextId, { context });
    return this.noteContextRepo.findOne({ where: { id: contextId } });
  }
}
