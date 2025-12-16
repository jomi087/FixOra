import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { INotificationAcknowledgmentUseCase } from "../../Interface/useCases/Public/INotificationAcknowledgmentUseCase";

export class NotificationAcknowledgmentUseCase implements INotificationAcknowledgmentUseCase {
    constructor(
        private readonly _notificationRepository: INotificationRepository
    ) { }

    async execute(notificationId: string): Promise<void> {
        try {
            await this._notificationRepository.markAsRead(notificationId);

        } catch (error:unknown) {
            throw error;
        }
    }
}