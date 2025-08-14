import { INotificationService } from "../../domain/interface/ServiceInterface/INotificationService.js";
import { BookingStatus } from "../../shared/Enums/BookingStatus.js";
import { getIO } from "../socket/config.js";

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

export class NotificationService implements INotificationService {
    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void {
        console.log("EMITTING booking:requested to providerId:", providerUserId, "payload:", payload)
        getIO().to(providerUserId).emit("booking:requested", payload);
    }

    notifyBookingResponseToUser(userId: string, payload:UserResponsNotificaton): void {
        console.log("EMITTING booking:response to userId:", userId, "payload:", payload)
        getIO().to(userId).emit("booking:response", payload)
    }
}
