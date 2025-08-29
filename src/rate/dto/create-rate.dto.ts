import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateRateDto {
  @IsNumber()
  teacherId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
