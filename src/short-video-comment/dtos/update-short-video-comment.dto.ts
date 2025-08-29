import { IsString, IsOptional } from 'class-validator';

export class UpdateShortVideoCommentDto {
  @IsString()
  @IsOptional()
  content?: string;
} 