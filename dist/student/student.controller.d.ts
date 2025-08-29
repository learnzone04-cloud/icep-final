import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';
import { TypesService } from 'src/types/types.service';
import { NotesService } from 'src/notes/notes.service';
export declare class StudentController {
    private readonly studentService;
    private readonly jwtService;
    private readonly typesService;
    private readonly notesService;
    constructor(studentService: StudentService, jwtService: JwtService, typesService: TypesService, notesService: NotesService);
    completeProfile(req: any, body: {
        work: string;
        typeId: number;
    }): Promise<any>;
    getMyIds(req: any): Promise<{
        senderId: any;
        studentId: any;
    }>;
}
