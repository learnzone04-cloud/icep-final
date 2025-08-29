import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateShortVideoDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsNumber()
  @Min(120) // Minimum 2 minutes (120 seconds)
  @Max(240) // Maximum 4 minutes (240 seconds)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  typeId?: string;
} 