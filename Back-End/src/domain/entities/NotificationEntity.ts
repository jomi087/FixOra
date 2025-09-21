import { NotificationType } from "../../shared/Enums/Notification";

export interface Notification {
  notificationId: string;
  userId: string; //receiver
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}