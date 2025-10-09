import { NotificationOutputDTO } from "../../../DTOs/NotificationDTO";

export interface IGetNotificationsUseCase {
    execute(userId: string):Promise<NotificationOutputDTO[]>
}