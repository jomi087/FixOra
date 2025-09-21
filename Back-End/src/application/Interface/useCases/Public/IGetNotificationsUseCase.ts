import { NotificationOutputDTO } from "../../../DTO's/NotificationDTO";

export interface IGetNotificationsUseCase {
    execute(userId: string):Promise<NotificationOutputDTO[]>
}