import { AutoRejectNotification, INotificationService, PaymentFailedNotification, ProviderBookingNotification, UserResponsNotificaton } from "../../domain/interface/ServiceInterface/INotificationService.js";
import { getIO } from "../socket/config.js";

export class NotificationService implements INotificationService {
    
    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void {
        getIO().to(providerUserId).emit("booking:requested", payload);
    }

    notifyBookingResponseToUser(userId: string, payload:UserResponsNotificaton): void {
        getIO().to(userId).emit("booking:response", payload)
    }

    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void {
        getIO().to(providerUserId).emit("booking:autoReject", payload);
    }

    notifyPaymentFailed(userId: string, payload: PaymentFailedNotification): void {
        getIO().to(userId).emit("payment:failed", payload);
    }
}
