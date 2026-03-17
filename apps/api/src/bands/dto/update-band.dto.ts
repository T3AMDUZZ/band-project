import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateBandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  snsLinks?: any;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
