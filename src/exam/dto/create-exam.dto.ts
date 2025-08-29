// src/exam/dto/create-exam.dto.ts

import { IsEnum, IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ExamType } from '../entities/exam.entity';

export class CreateExamDto {
  @IsEnum(ExamType)
  type: ExamType;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsOptional()
  @IsString()
  videoId?: string; // Nullable if not a specific video exam

  // Removed numberOfQuestions: it is always 50 by default in the entity
}