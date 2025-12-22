import { NotificationType } from "../../shared/enumss/Notification";

export interface NotificationOutputDTO {
    notificationId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: object;
    createdAt: string | Date;
    isRead: boolean;
}

export interface NotificationInput {
    userId: string;
    title: string;
    message: string;
    metadata: object;
}

export interface SendBookingConfirmedInput extends NotificationInput {}

export interface SendBookingCancelledInput extends NotificationInput {}

export interface SendWorkFinsihedInput extends NotificationInput {}
