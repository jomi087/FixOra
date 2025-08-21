import { INotificationService } from "../../domain/interface/ServiceInterface/INotificationService.js";
import { BookingStatus } from "../../shared/Enums/BookingStatus.js";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse.js";
import { getIO } from "../socket/config.js";

interface ProviderBookingNotification {
    bookingId: string;
    userName: string;
    issueType: string;
    scheduledAt: Date
    issue: string;
}

interface UserResponsNotificaton{
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

export class NotificationService implements INotificationService {
    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void {
       // console.log("EMITTING booking:requested to providerId:", providerUserId, "payload:", payload)
        getIO().to(providerUserId).emit("booking:requested", payload);
    }

    notifyBookingResponseToUser(userId: string, payload:UserResponsNotificaton): void {
     //   console.log("EMITTING booking:response to userId:", userId, "payload:", payload)
        getIO().to(userId).emit("booking:response", payload)
    }

    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void {
       // console.log("EMITTING booking:autoReject to providerId:", providerUserId, "payload:", payload)
        getIO().to(providerUserId).emit("booking:autoReject", payload);
    }

}
