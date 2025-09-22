import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { NotificationOutputDTO } from "../../DTO's/NotificationDTO";
import { IGetNotificationsUseCase } from "../../Interface/useCases/Public/IGetNotificationsUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

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

        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}