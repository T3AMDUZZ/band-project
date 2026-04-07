import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OrganizationTypeEnum } from './create-organization.dto';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(OrganizationTypeEnum)
  type?: OrganizationTypeEnum;

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
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  snsLinks?: any;
}
