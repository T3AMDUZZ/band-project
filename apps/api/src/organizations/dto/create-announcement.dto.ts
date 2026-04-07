import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
