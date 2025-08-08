interface ProviderBookingNotification {
    bookingId: string;
    userName: string;
    issueType: string;
    fullDate: string;
    time: string;
    issue: string;
}

export interface INotificationService {
    notifyBookingRequestToProvider(providerUserId: string , payload : ProviderBookingNotification): void
}