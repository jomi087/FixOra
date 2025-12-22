import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { NotificationOutputDTO } from "../../dtos/NotificationDTO";
import { IGetNotificationsUseCase } from "../../interfacetemp/useCases/public/IGetNotificationsUseCase";


export class GetNotificationsUseCase implements IGetNotificationsUseCase {
    constructor(
        private readonly _notificationRepository: INotificationRepository
    ) { }

    async execute(userId: string): Promise<NotificationOutputDTO[]> {
        try {
            let notifications = await this._notificationRepository.findByUserId(userId);

            const mappedData = notifications.map(({ notificationId, type, title, message, metadata, isRead, createdAt }) => {
                return {
                    notificationId,
                    type,
                    title,
                    message,
                    metadata,
                    isRead,
                    createdAt
                };
            });

            return mappedData;

        } catch (error:unknown) {
            throw error;
        }
    }
}