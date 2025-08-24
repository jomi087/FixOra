import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";

export interface ProviderBookingNotification {
    bookingId: string;
    userName: string;
    issueType: string;
    scheduledAt: Date
    issue: string;
}

export interface UserResponsNotificaton{
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

export interface PaymentFailedNotification {
    bookingId: string
    reason: string
}


export interface INotificationService {
    notifyBookingRequestToProvider(providerUserId: string , payload : ProviderBookingNotification): void
    notifyBookingResponseToUser(userId: string, payload: UserResponsNotificaton): void
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void
    notifyPaymentFailed(userId: string, payload: PaymentFailedNotification): void 

}   