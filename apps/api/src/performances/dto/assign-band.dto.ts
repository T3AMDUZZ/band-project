import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class AssignBandDto {
  @IsString()
  bandId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  playOrder?: number;
}
