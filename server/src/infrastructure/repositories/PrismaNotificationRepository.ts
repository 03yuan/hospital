import { PrismaClient } from '@prisma/client';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(notification: Notification): Promise<Notification> {
    const saved = await this.prisma.notification.create({
      data: {
        userId: notification.userId,
        title: notification.title,
        content: notification.content,
        relatedUrl: notification.relatedUrl,
        isRead: notification.isRead,
      },
    });
    return this.toEntity(saved);
  }

  async findByUserId(
    userId: number,
    options?: { isRead?: boolean; page?: number; pageSize?: number },
  ): Promise<{ list: Notification[]; total: number }> {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    const where: any = { userId };
    if (options?.isRead !== undefined) where.isRead = options.isRead;

    const [rows, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { list: rows.map((r) => this.toEntity(r)), total };
  }

  async markRead(id: number, userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  private toEntity(row: any): Notification {
    const notif = new Notification(
      {
        userId: row.userId,
        title: row.title,
        content: row.content,
        relatedUrl: row.relatedUrl ?? undefined,
      },
      row.id,
    );
    notif.isRead = row.isRead;
    (notif as any).createdAt = row.createdAt;
    return notif;
  }
}
