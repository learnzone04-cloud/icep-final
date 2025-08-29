import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { ExamType } from '../entities/exam.entity';

export class UpdateExamDto {
  @IsEnum(ExamType)
  @IsOptional()
  type?: ExamType;

  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsString()
  @IsOptional()
  videoId?: string;

  @IsNumber()
  @IsOptional()
  numberOfQuestions?: number;
}
