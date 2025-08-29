import { Student } from 'src/student/entity/Student';
import { NoteContext } from './NoteContext';
export declare class Note {
    id: number;
    studentId: number;
    title: string;
    student: Student;
    noteContexts: NoteContext[];
}
