export interface NotificationResponse {
  id: number;
  title: string;
  content: string;
  relatedUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  list: NotificationResponse[];
  total: number;
  unreadCount: number;
}
