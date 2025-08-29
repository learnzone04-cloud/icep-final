import { IsString, IsOptional } from 'class-validator';

export class UpdateReelDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  level?: string;
} 