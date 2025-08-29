import { Repository } from 'typeorm';
import { Note } from './entity/Note';
import { NoteContext } from './entity/NoteContext';
export declare class NotesService {
    private noteRepo;
    private noteContextRepo;
    constructor(noteRepo: Repository<Note>, noteContextRepo: Repository<NoteContext>);
    createNote(studentId: number, title?: string): Promise<Note>;
    createNoteContext(noteId: number, context: string, videoId?: number): Promise<NoteContext>;
    getNotesForStudent(studentId: number): Promise<Note[]>;
    deleteNote(noteId: number): Promise<import("typeorm").DeleteResult>;
    editNote(noteId: number, title: string): Promise<Note>;
    editNoteContext(contextId: number, context: string): Promise<NoteContext>;
}
