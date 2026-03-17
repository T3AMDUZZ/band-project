import { IsDateString, IsEnum } from 'class-validator';
import { AvailabilityStatus } from '@prisma/client';

export class SetAvailabilityDto {
  @IsDateString()
  date: string;

  @IsEnum(AvailabilityStatus)
  status: AvailabilityStatus;
}
