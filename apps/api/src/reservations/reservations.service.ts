import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findSentByUserId(userId: string) {
    // Find reservations where user is a member of the band
    const bandIds = await this.prisma.bandMember.findMany({
      where: { userId },
      select: { bandId: true },
    });

    return this.prisma.reservation.findMany({
      where: {
        bandId: { in: bandIds.map((b) => b.bandId) },
      },
      include: {
        band: true,
        venue: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findReceivedByUserId(userId: string) {
    // Find reservations for venues managed by the user
    const venueIds = await this.prisma.venue.findMany({
      where: { managerId: userId },
      select: { id: true },
    });

    return this.prisma.reservation.findMany({
      where: {
        venueId: { in: venueIds.map((v) => v.id) },
      },
      include: {
        band: true,
        venue: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateReservationDto, userId: string) {
    const reservation = await this.prisma.reservation.create({
      data: {
        bandId: dto.bandId,
        venueId: dto.venueId,
        requestedBy: userId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        eventType: dto.eventType ?? 'concert',
        expectedSize: dto.expectedSize,
        message: dto.message,
      },
      include: {
        band: true,
        venue: true,
      },
    });

    // 공연장 관리자에게 새 예약 요청 알림
    await this.notificationsService.sendNotification(
      reservation.venue.managerId,
      'RESERVATION_REQUESTED',
      `새 예약 요청: ${reservation.band.name}`,
      `${reservation.startTime}-${reservation.endTime} / ${reservation.eventType}`,
      reservation.id,
      'reservation',
    );

    return reservation;
  }

  async updateStatus(
    id: string,
    status: string,
    replyMessage?: string,
    userId?: string,
  ) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { venue: true },
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    // Only venue manager can approve/reject
    if (userId && reservation.venue.managerId !== userId) {
      throw new ForbiddenException('해당 공연장의 관리자만 상태를 변경할 수 있습니다.');
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: {
        status: status as any,
        replyMessage,
      },
      include: {
        band: true,
        venue: true,
      },
    });

    // Send notification to band members
    if (status === 'APPROVED' || status === 'REJECTED') {
      await this.notificationsService.notifyReservationUpdate(
        id,
        status as 'APPROVED' | 'REJECTED',
        replyMessage,
      );
    }

    return updated;
  }

  async cancel(id: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        band: { include: { members: true } },
      },
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    // Only band members can cancel their own reservation
    const isBandMember = reservation.band.members.some(
      (m) => m.userId === userId,
    );
    if (!isBandMember) {
      throw new ForbiddenException('해당 밴드의 멤버만 예약을 취소할 수 있습니다.');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        band: true,
        venue: true,
      },
    });
  }
}
