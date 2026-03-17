import { IsString, IsOptional, IsArray } from 'class-validator';

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
  snsLinks?: any;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
