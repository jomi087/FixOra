import { NotificationOutputDTO } from "../../../dto/NotificationDTO";

export interface IGetNotificationsUseCase {
    execute(userId: string):Promise<NotificationOutputDTO[]>
}