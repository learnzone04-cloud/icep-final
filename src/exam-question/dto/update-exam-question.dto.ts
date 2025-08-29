import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { CorrectAnswerEnum } from '../entities/exam-question.entity';

export class UpdateExamQuestionDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  firstAnswer?: string;

  @IsString()
  @IsOptional()
  secondAnswer?: string;

  @IsString()
  @IsOptional()
  thirdAnswer?: string;

  @IsString()
  @IsOptional()
  fourthAnswer?: string;

  @IsEnum(CorrectAnswerEnum)
  @IsOptional()
  correctAnswer?: CorrectAnswerEnum;

  @IsNumber()
  @IsOptional()
  examId?: number;
}
