import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PlacementLevel } from '../../placement-test/placement-test.entity';

export class UpdateCourseDto {
  @IsNumber()
  @IsOptional()
  typeId?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  tags?: string;
  
  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(PlacementLevel)
  @IsOptional()
  level?: PlacementLevel;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  videosNumber?: number;

  @IsNumber()
  @IsOptional()
  examCount?: number;

  @IsNumber()
  @IsOptional()
  passGrade?: number;

  @IsBoolean()
  @IsOptional()
  hasPassFailSystem?: boolean;
}
