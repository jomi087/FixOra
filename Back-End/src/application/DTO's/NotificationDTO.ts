import { NotificationType } from "../../shared/Enums/Notification";

export interface NotificationOutputDTO {
    type: NotificationType;
    title: string;
    message: string;
    metadata?: any;
    createdAt: string | Date;
    isRead: boolean;
}
