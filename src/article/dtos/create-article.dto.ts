import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  article: string;

  @IsString()
  tags: string;

  @IsString()
  @IsNotEmpty()
  level: string;
}
