import { NotesService } from './notes.service';
import { StudentService } from 'src/student/student.service';
export declare class NotesController {
    private readonly notesService;
    private readonly studentService;
    constructor(notesService: NotesService, studentService: StudentService);
    createNote(req: any, title?: string): Promise<import("./entity/Note").Note>;
    createNoteContext(noteId: number, context: string, videoId?: number): Promise<import("./entity/NoteContext").NoteContext>;
    getNotes(req: any): Promise<import("./entity/Note").Note[]>;
    deleteNote(noteId: number): Promise<import("typeorm").DeleteResult>;
    editNote(noteId: number, title: string): Promise<import("./entity/Note").Note>;
    editNoteContext(contextId: number, context: string): Promise<import("./entity/NoteContext").NoteContext>;
}
