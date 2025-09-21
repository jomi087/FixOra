import { v4 as uuidv4 } from "uuid";
import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/Enums/Notification";
import { Messages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export interface SendBookingCancelledInput {
    userId: string;
    title: string;
    message: string;
    metadata: any;
}

//inteface missing
export class SendBookingCancelledNotificationUseCase { 
    constructor(
        private _notificationRepository: INotificationRepository,
        private _notificationService: INotificationService
    ) { }

    async execute( input: SendBookingCancelledInput ): Promise<void> {
        try {
            const { userId, title, message, metadata } = input;
            
            const notification: Notification = {
                notificationId: uuidv4(),
                userId, //reciver
                type: NotificationType.BOOKING_CANCELLED,
                title,
                message,
                metadata,
                isRead: false,
                createdAt: new Date(),
            };

            await this._notificationRepository.save(notification);

            await this._notificationService.send(userId, {
                type:notification.type,
                title:notification.title,
                message:notification.message,
                metadata:notification.metadata,
                createdAt:notification.createdAt,
                isRead:notification.isRead,
            });

        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}


