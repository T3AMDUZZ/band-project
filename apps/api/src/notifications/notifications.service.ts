import { Injectable } from '@nestjs/common';
import * as webPush from 'web-push';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {
    const vapidPublic = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

    if (vapidPublic && vapidPrivate) {
      webPush.setVapidDetails(
        'mailto:admin@wearelive.kr',
        vapidPublic,
        vapidPrivate,
      );
    }
  }

  /** 알림 생성 + 푸시 전송 */
  async sendNotification(params: {
    recipientId: string;
    reservationId?: string;
    type: 'RESERVATION_APPROVED' | 'RESERVATION_REJECTED' | 'VENUE_ANNOUNCEMENT' | 'SHOW_REMINDER';
    title: string;
    body: string;
  }) {
    // 1. DB에 알림 저장
    const notification = await this.prisma.notification.create({
      data: {
        recipientId: params.recipientId,
        reservationId: params.reservationId,
        type: params.type,
        title: params.title,
        body: params.body,
      },
    });

    // 2. 해당 유저의 푸시 구독 찾기
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId: params.recipientId },
    });

    // 3. 각 구독에 푸시 전송
    const payload = JSON.stringify({
      title: params.title,
      body: params.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: {
        notificationId: notification.id,
        type: params.type,
        reservationId: params.reservationId,
      },
    });

    const pushResults = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
          );
        } catch (error: any) {
          // 410 Gone = 구독 만료, 삭제
          if (error?.statusCode === 410) {
            await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
          throw error;
        }
      }),
    );

    return {
      notification,
      pushSent: pushResults.filter((r) => r.status === 'fulfilled').length,
      pushFailed: pushResults.filter((r) => r.status === 'rejected').length,
    };
  }

  /** 예약 상태 변경 시 밴드 멤버들에게 알림 */
  async notifyReservationUpdate(
    reservationId: string,
    status: 'APPROVED' | 'REJECTED',
    venueMessage?: string,
  ) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        band: { include: { members: true } },
        venue: true,
      },
    });

    if (!reservation) return;

    const type = status === 'APPROVED' ? 'RESERVATION_APPROVED' : 'RESERVATION_REJECTED';
    const statusKo = status === 'APPROVED' ? '승인' : '거절';
    const title = `공연 예약 ${statusKo}`;
    const body = venueMessage
      ? `${reservation.venue.name}: ${venueMessage}`
      : `${reservation.venue.name}에서 ${reservation.band.name}의 예약을 ${statusKo}했습니다.`;

    // 밴드 멤버 전원에게 알림
    const results = await Promise.allSettled(
      reservation.band.members.map((member) =>
        this.sendNotification({
          recipientId: member.userId,
          reservationId,
          type: type as any,
          title,
          body,
        }),
      ),
    );

    return results;
  }

  /** 공연장 → 예약자 공지 알림 */
  async sendVenueAnnouncement(
    reservationId: string,
    title: string,
    message: string,
  ) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        band: { include: { members: true } },
        venue: true,
      },
    });

    if (!reservation) return;

    const results = await Promise.allSettled(
      reservation.band.members.map((member) =>
        this.sendNotification({
          recipientId: member.userId,
          reservationId,
          type: 'VENUE_ANNOUNCEMENT',
          title: `📢 ${reservation.venue.name}: ${title}`,
          body: message,
        }),
      ),
    );

    return results;
  }

  /** 유저 알림 목록 조회 */
  async getUserNotifications(userId: string, limit = 20) {
    return this.prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        reservation: {
          include: { venue: true, band: true },
        },
      },
    });
  }

  /** 알림 읽음 처리 */
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true },
    });
  }

  /** 전체 읽음 */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
  }

  /** 읽지 않은 알림 수 */
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    });
  }

  /** 푸시 구독 등록 */
  async subscribePush(userId: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId,
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  /** 푸시 구독 해제 */
  async unsubscribePush(endpoint: string) {
    return this.prisma.pushSubscription.deleteMany({
      where: { endpoint },
    });
  }
}
