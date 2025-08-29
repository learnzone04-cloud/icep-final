import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateTeacherDto {
  @IsUrl()
  facebookUrl: string;

  @IsUrl()
  instagramUrl: string;

  @IsString()
  coverLetter: string;

  @IsString()
  cv: string;

  @IsNumber()
  typeId: number;
}
