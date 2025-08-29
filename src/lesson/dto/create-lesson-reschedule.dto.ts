import { IsNumber, IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { RescheduleRequestedBy } from '../entity/LessonReschedule';

export class CreateLessonRescheduleDto {
  @IsNumber()
  lessonId: number;

  @IsEnum(RescheduleRequestedBy)
  requestedBy: RescheduleRequestedBy;

  @IsDateString()
  oldDate: string; // Format: "2024-01-15"

  @IsString()
  oldStartTime: string; // Format: "10:15"

  @IsDateString()
  newDate: string; // Format: "2024-01-15"

  @IsString()
  newStartTime: string; // Format: "14:00"

  @IsString()
  @IsOptional()
  reason?: string;
} 