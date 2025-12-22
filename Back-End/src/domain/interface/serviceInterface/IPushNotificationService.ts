export interface fcmTokens {
    token: string;
    platform: string;
    createdAt: Date;
};

export interface payload {
    title: string,
    body: string,
    data?: Record<string,string>
}


export interface IPushNotificationService {
    sendPushNotificationToUser(fcmTokens: fcmTokens[], payload: payload): Promise<void>;
}   