import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  bandId: string;

  @IsString()
  venueId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
