import {
    AutoRejectNotification, INotificationService, PaymentFailureNotification,
    PaymentSuccessNotification, ProviderBookingNotification, UserResponsNotificaton
} from "../../domain/interface/ServiceInterface/INotificationService";
import { getIO } from "../socket/config";

export class NotificationService implements INotificationService {
    //booking request (user to provider)
    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void {
        getIO().to(providerUserId).emit("booking:requested", payload);
    }
    //provider response ( provider to user)
    notifyBookingResponseToUser(userId: string, payload:UserResponsNotificaton): void {
        getIO().to(userId).emit("booking:response", payload)
    }
    //auto reject 
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void {
        getIO().to(providerUserId).emit("booking:autoReject", payload);
    }

    notifyPaymentSuccessToUser(userId: string, payload: PaymentSuccessNotification): void {
        getIO().to(userId).emit("payment:success", payload);
    }

    notifyPaymentFailureToUser(userId: string, payload: PaymentFailureNotification): void {
        getIO().to(userId).emit("payment:failure", payload);
    }

}
