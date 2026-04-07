import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AvailabilityStatus } from '@prisma/client';

export class SetAvailabilityDto {
  @IsDateString()
  date: string;

  @IsEnum(AvailabilityStatus)
  status: AvailabilityStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
