import { IsString, IsNotEmpty } from 'class-validator';

export class SendAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
