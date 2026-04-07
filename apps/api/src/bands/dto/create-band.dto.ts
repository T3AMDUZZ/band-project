import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { BandStatus } from '@prisma/client';

export class CreateBandDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  genre: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  snsLinks?: any;

  @IsOptional()
  @IsEnum(BandStatus)
  status?: BandStatus;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
