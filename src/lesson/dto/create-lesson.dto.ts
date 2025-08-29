import { IsNumber, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { LessonStatus } from '../entity/Lesson';

export class CreateLessonDto {
  @IsNumber()
  teacherId: number;

  @IsNumber()
  studentId: number;

  @IsDateString()
  lessonDate: string; // Format: "2024-01-15"

  @IsString()
  startTime: string; // Format: "10:15"

  @IsEnum(LessonStatus)
  @IsOptional()
  status?: LessonStatus;

  @IsString()
  @IsOptional()
  notes?: string;
} 