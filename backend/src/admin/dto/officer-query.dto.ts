import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBooleanString,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  unionPosition?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
