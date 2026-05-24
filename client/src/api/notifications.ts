import client from './client';
import type { NotificationItem, NotificationListResponse } from '../types';

export async function getNotifications(params?: {
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<NotificationListResponse> {
  const res = await client.get('/notifications', { params });
  return res.data.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await client.get('/notifications/unread-count');
  return res.data.data.count;
}

export async function markRead(id: number): Promise<void> {
  await client.patch(`/notifications/${id}/read`);
}

export async function markAllRead(): Promise<void> {
  await client.post('/notifications/read-all');
}
