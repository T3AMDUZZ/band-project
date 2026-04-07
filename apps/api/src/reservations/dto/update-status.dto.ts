import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReservationStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class UpdateStatusDto {
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

  @IsOptional()
  @IsString()
  replyMessage?: string;
}
