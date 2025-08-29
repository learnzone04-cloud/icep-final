import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  studentId: number;

  @IsNumber()
  teacherId: number;
}

export class SendMessageDto {
  @IsNumber()
  chatId: number;

  @IsString()
  message: string;
} 