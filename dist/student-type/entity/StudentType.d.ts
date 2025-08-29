import { Student } from 'src/student/entity/Student';
import { TypeEntity } from 'src/types/entity/Type';
export declare class StudentType {
    StudentTypeId: number;
    typeId: number;
    studentId: number;
    type: TypeEntity;
    student: Student;
    level: string;
}
