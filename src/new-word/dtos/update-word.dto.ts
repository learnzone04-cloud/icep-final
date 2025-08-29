import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateNewWordDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  word?: string;

  @IsOptional()
  @IsString()
  phraseExample?: string;
}
