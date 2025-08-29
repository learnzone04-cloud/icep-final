import { IsString, IsNotEmpty, IsNumber, MinLength, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @IsNumber()
  typeId: number;
} 