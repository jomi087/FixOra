import { Notification } from "../../entities/NotificationEntity";

export interface INotificationRepository {
    save(notification: Notification): Promise<Notification>;
    findByUserId(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
}

//send(userId: string, type: NotificationType, message: string, metadata?: any): Promise<void>;
//getUserNotifications(userId: string): Promise<Notification[]>;
//markAsRead(notificationId: string): Promise<void>;