import { LessonStatus } from '../entity/Lesson';
export declare class CreateLessonDto {
    teacherId: number;
    studentId: number;
    lessonDate: string;
    startTime: string;
    status?: LessonStatus;
    notes?: string;
}
