import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { NotificationType } from "../../../shared/Enums/Notification";
// import { NotificationType } from "../../../shared/Enums/Notification";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";

export interface NotificationPayload {
    type: NotificationType;
    title: string;
    message: string;
    metadata?: any;
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
    acknowledgment: {
        isWorkCompletedByProvider: boolean;
        isWorkConfirmedByUser: boolean;
    }
}

export interface INotificationService {
    send(userId: string, payload: NotificationPayload): Promise<void>;

    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void

    notifyBookingResponseToUser(userId: string, payload: UserResponsNotificaton): void
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void
    autoRejectTimeOutPayment(userId: string, bookingId: string): void

    notifyPaymentSuccessToUser(userId: string): void
    notifyPaymentFailureToUser(userId: string, reason: string): void

    //notifyBookingConfirmation(providerUserId: string, payload: ConfirmBookingNotification): void
    //notifyBookingCancellation(providerUserId: string, bookingId: string): void

}   