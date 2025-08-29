import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReelDto {
  @IsString()
  @IsOptional()
  reelPath?: string;

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
