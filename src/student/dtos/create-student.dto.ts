import { IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsOptional()
  @IsString()
  work?: string;
}
