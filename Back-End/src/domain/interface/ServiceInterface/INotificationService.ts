import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { NotificationType } from "../../../shared/enums/Notification";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";

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
    send(userId: string, payload: NotificationPayload): Promise<void>;
    sendToRole(role: string, payload: NotificationPayload): Promise<void>

    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void
    notifyBookingResponseToUser(userId: string, payload: UserResponsNotificaton): void
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void
    autoRejectTimeOutPayment(userId: string, bookingId: string): void
    
    notifyPaymentSuccessToUser(userId: string): void
    notifyPaymentFailureToUser(userId: string, reason: string): void

    //notifyBookingConfirmation(providerUserId: string, payload: ConfirmBookingNotification): void
    //notifyBookingCancellation(providerUserId: string, bookingId: string): void

}   