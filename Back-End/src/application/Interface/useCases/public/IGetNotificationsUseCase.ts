import { NotificationOutputDTO } from "../../../dtos/NotificationDTO";

export interface IGetNotificationsUseCase {
    execute(userId: string):Promise<NotificationOutputDTO[]>
}