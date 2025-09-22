
export interface INotificationAcknowledgmentUseCase {
    execute(notificationId: string):Promise<void>
}