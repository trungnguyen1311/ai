import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import {
  Department,
  UnionPosition,
  Gender,
  WorkStatus,
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

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  unitName?: string;

  @IsOptional()
  @IsEnum(WorkStatus)
  workStatus?: WorkStatus;

  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @IsOptional()
  @IsBoolean()
  isPartyMember?: boolean;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  achievements?: string;
}
