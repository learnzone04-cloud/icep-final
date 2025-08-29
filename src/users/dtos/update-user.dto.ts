import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../entity/User';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fName?: string;
  @IsString()
  @IsOptional()
  lName?: string;
  @IsString()
  @IsOptional()
  phoneNumber?: string;
  @IsBoolean()
  @IsOptional()
  active?: boolean;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
