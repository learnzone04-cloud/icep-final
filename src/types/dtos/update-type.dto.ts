import { IsOptional, IsString } from 'class-validator';

export class UpdateTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}
