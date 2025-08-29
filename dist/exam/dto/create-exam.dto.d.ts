import { ExamType } from '../entities/exam.entity';
export declare class CreateExamDto {
    type: ExamType;
    courseId: number;
    videoId?: string;
}
