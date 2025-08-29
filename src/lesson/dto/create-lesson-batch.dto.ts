import { IsNumber, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SingleLessonDto {
  @IsString()
  lessonDate: string; // "YYYY-MM-DD"

  @IsString()
  startTime: string;  // "HH:mm"

  @IsString()
  endTime: string;    // "HH:mm"
}

export class CreateLessonBatchDto {
  @IsNumber()
  teacherId: number;

  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsNumber()
  chatId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleLessonDto)
  lessons: SingleLessonDto[];

  @IsNumber()
  price: number;
} 