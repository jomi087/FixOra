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

export interface NotificationInput {
    userId: string;
    title: string;
    message: string;
    metadata: any;
}

export interface SendBookingConfirmedInput extends NotificationInput {}

export interface SendBookingCancelledInput extends NotificationInput {}
