import { Exam } from 'src/exam/entities/exam.entity';
export declare enum CorrectAnswerEnum {
    FIRST = "FIRST",
    SECOND = "SECOND",
    THIRD = "THIRD",
    FOURTH = "FOURTH"
}
export declare class ExamQuestion {
    id: number;
    question: string;
    firstAnswer: string;
    secondAnswer: string;
    thirdAnswer: string;
    fourthAnswer: string;
    exam: Exam;
    correctAnswer: CorrectAnswerEnum;
}
