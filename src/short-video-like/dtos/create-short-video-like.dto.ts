import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateShortVideoLikeDto {
  @IsNumber()
  @IsNotEmpty()
  shortVideoId: number;
} 