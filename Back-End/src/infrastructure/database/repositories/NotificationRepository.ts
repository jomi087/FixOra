import { Notification } from "../../../domain/entities/NotificationEntity";
import { INotificationRepository } from "../../../domain/interface/repositoryInterfaceTempName/INotificationRepository";
import NotificationModel from "../models/NotificationModel";

export class NotificationRepository implements INotificationRepository {
    async save(notification: Notification): Promise<Notification> {
        const doc = new NotificationModel(notification);
        await doc.save();
        return notification;
    }

    async saveMany(notifications: Notification[]): Promise<void> {
        await NotificationModel.insertMany(notifications);
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        return NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
    }

    async markAsRead(notificationId: string): Promise<void> {
        await NotificationModel.updateOne({ notificationId: notificationId }, { $set: { isRead: true } });
    }


}
