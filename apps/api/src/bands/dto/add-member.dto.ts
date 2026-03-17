import { IsString, IsOptional, IsEnum } from 'class-validator';
import { BandMemberRole } from '@prisma/client';

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(BandMemberRole)
  role?: BandMemberRole;

  @IsOptional()
  @IsString()
  part?: string;
}
