import { fcmTokens, IPushNotificationService, payload } from "../../domain/interface/ServiceInterface/IPushNotificationService";
import { firebaseAdmin } from "../firebase/firebaseAdmin";

export class PushNotificationService implements IPushNotificationService {

    async sendPushNotificationToUser(fcmTokens: fcmTokens[], payload: payload): Promise<void> {
        try {
            //via notifiaction payload
            const messages = fcmTokens.map(tokenObj => ({
                token: tokenObj.token,
                notification: {
                    title: payload.title,
                    body: payload.body
                },
                webpush: {
                    fcmOptions: {
                        link: `${process.env.FRONTEND_URL}/provider/dashboard` // optional: URL to open when clicked
                    }
                }
            }));

            await firebaseAdmin.messaging().sendEach(messages);
        } catch (error: unknown) {
            throw error;
        }
    }
}

/*  via data + showNotification(FE)

    Send push notification as fallback if provider is offline
    await this.pushNotifcation(id, {  
        data: {
            bookingId: bookingInfo.bookingId,
            userName: `${userInfo.fname} ${userInfo.lname}`,
            issueType: `${subCategoryInfo.name}`,
            scheduledAt: bookingInfo.scheduledAt.toString(),
            frontendUrl: `${process.env.FRONTEND_URL}/provider/dashboard`
        }
    });

    
    const messages = fcmTokens.map(tokenObj => ({
        token: tokenObj.token,
        data: payload.data||{},
    }));
*/