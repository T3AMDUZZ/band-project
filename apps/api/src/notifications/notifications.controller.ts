import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendAnnouncementDto } from './dto/send-announcement.dto';
import { SubscribePushDto } from './dto/subscribe-push.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** 유저 알림 목록 조회 */
  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      userId,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  /** 읽지 않은 알림 수 */
  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  /** 알림 읽음 처리 */
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    await this.notificationsService.markAsRead(id, userId);
    return { success: true };
  }

  /** 전체 읽음 */
  @Patch('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  /** 예약 승인/거절 시 알림 전송 */
  @Post('reservation/:reservationId/status')
  async notifyReservationUpdate(
    @Param('reservationId') reservationId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
    @Body('message') message?: string,
  ) {
    const results = await this.notificationsService.notifyReservationUpdate(
      reservationId,
      status,
      message,
    );
    return { success: true, results };
  }

  /** 공연장 → 예약자에게 공지 알림 전송 */
  @Post('reservation/:reservationId/announce')
  async sendVenueAnnouncement(
    @Param('reservationId') reservationId: string,
    @Body() dto: SendAnnouncementDto,
  ) {
    const results = await this.notificationsService.sendVenueAnnouncement(
      reservationId,
      dto.title,
      dto.message,
    );
    return { success: true, results };
  }

  /** 푸시 구독 등록 */
  @Post('push/subscribe')
  async subscribePush(@Body() dto: SubscribePushDto) {
    await this.notificationsService.subscribePush(dto.userId, {
      endpoint: dto.endpoint,
      keys: { p256dh: dto.p256dh, auth: dto.auth },
    });
    return { success: true };
  }

  /** 푸시 구독 해제 */
  @Post('push/unsubscribe')
  async unsubscribePush(@Body('endpoint') endpoint: string) {
    await this.notificationsService.unsubscribePush(endpoint);
    return { success: true };
  }
}
