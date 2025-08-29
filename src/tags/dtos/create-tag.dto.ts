import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  typeId: number;
}

