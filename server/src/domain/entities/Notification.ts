interface NotificationProps {
  userId: number;
  title: string;
  content: string;
  relatedUrl?: string;
}

export class Notification {
  public readonly id?: number;
  public userId: number;
  public title: string;
  public content: string;
  public relatedUrl?: string;
  public isRead: boolean;
  public createdAt: Date;

  constructor(props: NotificationProps, id?: number) {
    this.id = id;
    this.userId = props.userId;
    this.title = props.title;
    this.content = props.content;
    this.relatedUrl = props.relatedUrl;
    this.isRead = false;
    this.createdAt = new Date();
  }

  markAsRead(): void {
    this.isRead = true;
  }
}
