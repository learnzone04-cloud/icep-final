import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PlacementLevel } from '../../placement-test/placement-test.entity';

export class CreateCourseDto {
  @IsNumber()
  @IsOptional()
  teacherId: number;

  @IsNumber()
  @IsNotEmpty()
  typeId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  tags: string;
  
  @IsString()
  duration: string;

  @IsEnum(PlacementLevel)
  @IsOptional()
  level?: PlacementLevel;

  @IsBoolean()
  @IsOptional()
  hasPassFailSystem?: boolean;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  passGrade?: number;

  @IsNumber()
  @IsOptional()
  videosNumber?: number;
}
