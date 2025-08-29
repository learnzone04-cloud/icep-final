import { CorrectAnswerEnum } from '../entities/exam-question.entity';
export declare class CreateExamQuestionDto {
    question: string;
    firstAnswer: string;
    secondAnswer: string;
    thirdAnswer: string;
    fourthAnswer: string;
    correctAnswer: CorrectAnswerEnum;
}
