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
}
