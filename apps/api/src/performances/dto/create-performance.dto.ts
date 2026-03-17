import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';

export enum PerformanceStatusEnum {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreatePerformanceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

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
