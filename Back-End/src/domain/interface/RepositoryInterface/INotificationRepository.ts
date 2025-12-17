import { Notification } from "../../entities/NotificationEntity";

export interface INotificationRepository {
    save(notification: Notification): Promise<Notification>;
    saveMany(notification:Notification[]):Promise<void>
    findByUserId(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
}
