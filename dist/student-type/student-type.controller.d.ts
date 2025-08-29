import { Repository } from 'typeorm';
import { StudentType } from './entity/StudentType';
import { StudentService } from 'src/student/student.service';
export declare class StudentTypeController {
    private readonly studentTypeRepo;
    private readonly studentService;
    constructor(studentTypeRepo: Repository<StudentType>, studentService: StudentService);
    getMyStudentTypes(req: any): Promise<StudentType[]>;
}
