import { ExamType } from '../entities/exam.entity';
export declare class UpdateExamDto {
    type?: ExamType;
    courseId?: number;
    videoId?: string;
    numberOfQuestions?: number;
}
