import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
export declare class Rate {
    id: number;
    studentId: number;
    teacherId: number;
    rating: number;
    comment: string;
    student: Student;
    teacher: TeacherEntity;
    createdAt: Date;
}
