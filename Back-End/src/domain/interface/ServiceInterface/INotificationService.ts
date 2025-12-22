import { BookingStatus } from "../../../shared/enumss/BookingStatus";
import { NotificationType } from "../../../shared/enumss/Notification";
import { ProviderResponseStatus } from "../../../shared/enumss/ProviderResponse";

export interface NotificationPayload {
    // notificationId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: object;
    createdAt: Date;
    isRead: boolean;
}

export interface ProviderBookingNotification {
    bookingId: string;
    userName: string;
    issueType: string;
    scheduledAt: Date
    issue: string;
}

export interface UserResponsNotificaton {
    bookingId: string;
    response: ProviderResponseStatus;
    scheduledAt: Date
    reason?: string;
}

export interface AutoRejectNotification {
    bookingId: string
    response: ProviderResponseStatus;
    reason: string
}

export interface ConfirmBookingNotification {
    bookingId: string;
    scheduledAt: Date;
    status: BookingStatus;
}

export interface INotificationService {
    send(userId: string, payload: NotificationPayload): void;
    sendToRole(role: string, payload: NotificationPayload): void;

    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void
    notifyBookingResponseToUser(userId: string, payload: UserResponsNotificaton): void
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void
    autoRejectTimeOutPayment(userId: string, bookingId: string): void

    notifyPaymentSuccessToUser(userId: string): void
    notifyPaymentFailureToUser(userId: string, reason: string): void
}   