import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { Booking } from "../../entities/BookingEntity.js";

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
    reason?: string;
}

export interface INotificationService {
    notifyBookingRequestToProvider(providerUserId: string , payload : ProviderBookingNotification): void
    notifyBookingResponseToUser(userId:string, payload : UserResponsNotificaton ):void
}   