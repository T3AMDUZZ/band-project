import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum OrganizationTypeEnum {
  UNIVERSITY_CLUB = 'UNIVERSITY_CLUB',
  BAND_UNION = 'BAND_UNION',
  INDIE_COLLECTIVE = 'INDIE_COLLECTIVE',
  PLANNING_TEAM = 'PLANNING_TEAM',
  OTHER = 'OTHER',
}

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsEnum(OrganizationTypeEnum)
  type: OrganizationTypeEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
