import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  certificate?: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;

  @IsOptional()
  @IsString()
  cv?: string;
}
