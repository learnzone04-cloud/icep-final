import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class GetHistoryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  beforeId?: number;
} 