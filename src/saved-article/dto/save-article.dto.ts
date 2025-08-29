import { IsNumber } from 'class-validator';

export class SaveArticleDto {
  @IsNumber()
  articleId: number;
} 