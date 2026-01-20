import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Gender,
  Department,
  UnionPosition,
  WorkStatus,
} from '../entities/officer-profile.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, {
    message: 'Số điện thoại không hợp lệ (Việt Nam)',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsBoolean()
  isPartyMember?: boolean;

  @IsOptional()
  @IsDateString()
  joinDate?: Date;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  unitName?: string;

  @IsOptional()
  @IsEnum(UnionPosition)
  unionPosition?: UnionPosition;

  @IsOptional()
  @IsEnum(WorkStatus)
  workStatus?: WorkStatus;

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

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEnum(UnionPosition)
  unionPosition: UnionPosition;

  @IsNotEmpty()
  @IsEnum(Department)
  department: Department;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsBoolean()
  isPartyMember?: boolean;

  @IsOptional()
  @IsDateString()
  joinDate?: Date;

  @IsOptional()
  @IsString()
  unitName?: string;

  @IsOptional()
  @IsEnum(WorkStatus)
  workStatus?: WorkStatus;

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
