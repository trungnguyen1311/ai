import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBooleanString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Department,
  UnionPosition,
} from '../../profile/entities/officer-profile.entity';

export class OfficerQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @IsOptional()
  @IsEnum(UnionPosition)
  unionPosition?: UnionPosition;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
