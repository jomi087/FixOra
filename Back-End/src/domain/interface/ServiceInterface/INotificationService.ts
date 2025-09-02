import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";

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

export interface PaymentSuccessNotification {
    bookingId: string
    status: BookingStatus //is it required
    
}

export interface PaymentFailureNotification {
    bookingId: string
    reason: string
    status : BookingStatus //is it required
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
    notifyBookingRequestToProvider(providerUserId: string , payload : ProviderBookingNotification): void
    notifyBookingResponseToUser(userId: string, payload: UserResponsNotificaton): void
    
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void
    
    notifyPaymentSuccessToUser(userId: string, payload: PaymentSuccessNotification): void 
    notifyPaymentFailureToUser(userId: string, payload: PaymentFailureNotification): void 

    notifyBookingConfirmation(providerUserId: string, payload : ConfirmBookingNotification):void

}   