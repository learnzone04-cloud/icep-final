import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShortVideoCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  shortVideoId: number;
} 