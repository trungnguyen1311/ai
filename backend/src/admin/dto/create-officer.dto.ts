import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import {
  Department,
  UnionPosition,
} from '../../profile/entities/officer-profile.entity';

export class CreateOfficerDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsEnum(Department)
  department: Department;

  @IsNotEmpty()
  @IsEnum(UnionPosition)
  unionPosition: UnionPosition;
}
