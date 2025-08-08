import { INotificationService } from "../../domain/interface/ServiceInterface/INotificationService.js";
import { getIO } from "../socket/config.js";

interface ProviderBookingNotification {
    bookingId: string;
    userName: string;
    issueType: string;
    fullDate: string;
    time: string;
    issue: string;
}

export class NotificationService implements INotificationService {
    notifyBookingRequestToProvider(providerUserId: string, payload: ProviderBookingNotification): void {
        console.log("EMITTING booking:requested to providerId:", providerUserId, "payload:", payload)
        getIO().to(providerUserId).emit("booking:requested", payload);
    }
    
    // notifyCustomerBookingStatus(userId: string, payload: "ACCEPT"|"REJECT"): void {
    //     getIO().to(userId).emit("booking:status", payload);
    // }
}
