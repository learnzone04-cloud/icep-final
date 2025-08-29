import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
export declare class Follower {
    id: number;
    teacherId: number;
    studentId: number;
    teacher: TeacherEntity;
    student: Student;
}
