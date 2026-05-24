import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByUserId(
    userId: number,
    options?: { isRead?: boolean; page?: number; pageSize?: number },
  ): Promise<{ list: Notification[]; total: number }>;
  markRead(id: number, userId: number): Promise<void>;
  markAllRead(userId: number): Promise<void>;
  countUnread(userId: number): Promise<number>;
}
