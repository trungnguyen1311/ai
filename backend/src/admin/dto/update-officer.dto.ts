import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  Department,
  UnionPosition,
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

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
