import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  bandId: string;

  @IsString()
  venueId: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  expectedSize?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
