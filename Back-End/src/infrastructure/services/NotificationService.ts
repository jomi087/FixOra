import {
    AutoRejectNotification,INotificationService, NotificationPayload,
    ProviderBookingNotification, UserResponsNotificaton
} from "../../domain/interface/serviceInterfaceTempName/INotificationService";
import { getIO } from "../socket/config";

export class NotificationService implements INotificationService {
    send(userId: string, payload: NotificationPayload): void {
        getIO().to(userId).emit("notification", payload);
    }

    sendToRole(role: string, payload: NotificationPayload): void {
        getIO().to(role).emit("notification", payload);
    }

    //booking request (user to provider)
    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void {
        getIO().to(providerUserId).emit("booking:requested", payload);
    }

    //provider response ( provider to user)
    notifyBookingResponseToUser(userId: string, payload: UserResponsNotificaton): void {
        getIO().to(userId).emit("booking:response", payload);
    }

    //auto reject 
    notifyBookingAutoRejectToProvider(providerUserId: string, payload: AutoRejectNotification): void {
        getIO().to(providerUserId).emit("booking:autoReject", payload);
    }

    autoRejectTimeOutPayment(userId: string, bookingId: string): void {
        getIO().to(userId).emit("payment:autoReject", bookingId);
    }

    notifyPaymentSuccessToUser(userId: string): void {
        getIO().to(userId).emit("payment:success");
    }

    notifyPaymentFailureToUser(userId: string, reason: string): void {
        getIO().to(userId).emit("payment:failure", reason);
    }


}