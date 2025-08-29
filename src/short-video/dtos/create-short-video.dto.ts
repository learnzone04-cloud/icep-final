import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShortVideoDto {
  @IsString()
  @IsOptional()
  videoPath?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  tags: string;

  @IsString()
  @IsNotEmpty()
  level: string;
} 