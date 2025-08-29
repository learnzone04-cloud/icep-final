import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateTeacherProfileDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  certificates?: string[];

  @IsOptional()
  @IsString()
  cv?: string;
} 