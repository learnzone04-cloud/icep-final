import { Student } from '../../student/entity/Student';
import { TeacherEntity } from '../../teacher/entity/Teacher';
export declare class Chat {
    id: number;
    student: Student;
    teacher: TeacherEntity;
    createdAt: Date;
    updatedAt: Date;
}
