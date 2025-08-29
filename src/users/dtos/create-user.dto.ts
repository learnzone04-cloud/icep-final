import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../entity/User';

export class CreateUserDto {
  @IsString()
  fName: string;
  @IsString()
  lName: string;
  @IsString()
  phoneNumber: string;
  @IsBoolean()
  @IsOptional()
  active: boolean;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
