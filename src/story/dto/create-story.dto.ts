import { IsString, IsOptional } from 'class-validator';

export class CreateStoryDto {

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;


} 