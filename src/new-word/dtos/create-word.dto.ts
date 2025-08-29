import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNewWordDto {
  @IsString()
  @MinLength(1)
  word: string;

  @IsOptional()
  @IsString()
  phraseExample?: string;
}
