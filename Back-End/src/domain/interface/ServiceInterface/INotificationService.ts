import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";

interface ProviderBookingNotification {
    bookingId: string;
    userName: string;
    issueType: string;
    fullDate: string;
    time: string;
    issue: string;
}

interface UserResponsNotificaton{
    bookingId: string;
    status: BookingStatus;
    fullDate: string;
    time: string;
    reason?: string;
}

export interface INotificationService {
    notifyBookingRequestToProvider(providerUserId: string , payload : ProviderBookingNotification): void
    notifyBookingResponseToUser(userId:string, payload : UserResponsNotificaton ):void
}   