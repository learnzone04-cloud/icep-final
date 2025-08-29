import { Exam } from '../exam/entities/exam.entity';
import { Student } from '../student/entity/Student';
export declare class ExamStudent {
    id: number;
    examId: number;
    studentId: number;
    courseId: number;
    mark: number | null;
    examType?: string;
    exam: Exam;
    student: Student;
}
