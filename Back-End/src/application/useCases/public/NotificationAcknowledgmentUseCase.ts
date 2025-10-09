import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { INotificationAcknowledgmentUseCase } from "../../Interface/useCases/Public/INotificationAcknowledgmentUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class NotificationAcknowledgmentUseCase implements INotificationAcknowledgmentUseCase {
    constructor(
        private readonly _notificationRepository: INotificationRepository
    ){}
    
    async execute(notificationId: string): Promise<void> {
        try {
            await this._notificationRepository.markAsRead(notificationId);

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}