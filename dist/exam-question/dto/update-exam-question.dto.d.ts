import { CorrectAnswerEnum } from '../entities/exam-question.entity';
export declare class UpdateExamQuestionDto {
    question?: string;
    firstAnswer?: string;
    secondAnswer?: string;
    thirdAnswer?: string;
    fourthAnswer?: string;
    correctAnswer?: CorrectAnswerEnum;
    examId?: number;
}
