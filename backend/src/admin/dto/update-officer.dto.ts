import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Department,
  UnionPosition,
  Gender,
  WorkStatus,
} from '../../profile/entities/officer-profile.entity';

export class UpdateOfficerDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsEnum(Department)
  @IsOptional()
  department?: Department;

  @IsEnum(UnionPosition)
  @IsOptional()
  unionPosition?: UnionPosition;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  personalEmail?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isPartyMember?: boolean;

  @IsDateString()
  @Type(() => Date)
  @IsOptional()
  joinDate?: Date;

  @IsDateString()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  unitName?: string;

  @IsEnum(WorkStatus)
  @IsOptional()
  workStatus?: WorkStatus;

  @IsString()
  @IsOptional()
  education?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  skills?: string;

  @IsString()
  @IsOptional()
  achievements?: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
