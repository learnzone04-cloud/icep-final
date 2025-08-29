import { IsString, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  article?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  level?: string;
}
