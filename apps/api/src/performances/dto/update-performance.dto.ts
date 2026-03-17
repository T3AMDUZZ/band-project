import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';
import { PerformanceStatusEnum } from './create-performance.dto';

export class UpdatePerformanceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  venueId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ticketPrice?: number;

  @IsOptional()
  @IsString()
  posterImage?: string;

  @IsOptional()
  @IsEnum(PerformanceStatusEnum)
  status?: PerformanceStatusEnum;
}
