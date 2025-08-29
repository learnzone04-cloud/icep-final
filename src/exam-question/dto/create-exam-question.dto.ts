import { CorrectAnswerEnum } from '../entities/exam-question.entity';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';


export class CreateExamQuestionDto {
  @IsString()
  question: string;

  @IsString()
  firstAnswer: string;

  @IsString()
  secondAnswer: string;

  @IsString()
  thirdAnswer: string;

  @IsString()
  fourthAnswer: string;

  @IsEnum(CorrectAnswerEnum)
  correctAnswer: CorrectAnswerEnum;
  // examId removed; it will be provided in the header
}
