import { NotificationType } from "../../shared/Enums/Notification";

export interface NotificationOutputDTO {
    notificationId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: any;
    createdAt: string | Date;
    isRead: boolean;
}
