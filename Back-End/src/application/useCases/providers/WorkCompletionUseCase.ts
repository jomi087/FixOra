import { v4 as uuidv4 } from "uuid";

import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IImageUploaderService } from "../../../domain/interface/ServiceInterface/IImageUploaderService";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { WorkCompletionInputDTO, WorkCompletionOutputDTO } from "../../DTO's/WorkCompletionDTO";
import { IWorkCompletionUseCase } from "../../Interface/useCases/Provider/IWorkCompletionUseCase";
import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";
import { PLATFORM_FEE } from "../../../shared/constants";
import { TransactionStatus, TransactionType } from "../../../shared/Enums/Transaction";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { NotificationType } from "../../../shared/Enums/Notification";
import { SendWorkFinsihedInput } from "../../DTO's/NotificationDTO";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND, NOT_FOUND_MSG } = Messages;


export class WorkCompletionUseCase implements IWorkCompletionUseCase {

    constructor(
        private readonly _imageUploaderService: IImageUploaderService,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _notificationService: INotificationService,
        private readonly _notificationRepository: INotificationRepository,
    ) { }

    private async sendCompletedWorkNotification(input: SendWorkFinsihedInput): Promise<void> {
        try {
            const { userId, title, message, metadata } = input;

            const notification: Notification = {
                notificationId: uuidv4(),
                userId, //reciver
                type: NotificationType.BOOKING_COMPLETED,
                title,
                message,
                metadata,
                isRead: false,
                createdAt: new Date(),
            };

            await this._notificationRepository.save(notification);

            await this._notificationService.send(userId, {
                type: notification.type,
                title: notification.title,
                message: notification.message,
                metadata: notification.metadata,
                createdAt: notification.createdAt,
                isRead: notification.isRead,
            });

        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

    async execute(input: WorkCompletionInputDTO): Promise<WorkCompletionOutputDTO> {
        try {
            const workProofUrls: string[] = [];

            for (const file of input.plainFiles) {
                const url = await this._imageUploaderService.uploadImage(
                    file.buffer,
                    `FixOra/work_proofs/${input.bookingId}`
                );
                workProofUrls.push(url);
            }

            const bookingData = await this._bookingRepository.findByBookingId(input.bookingId);
            if (!bookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

            const transactionId = `Wlt_${uuidv4()}`;
            const numAmount = Number(bookingData.esCrowAmout);
            const providerAmount = numAmount - PLATFORM_FEE;

            await this._walletRepository.updateWalletOnTransaction({
                userId: bookingData.providerUserId,
                transactionId: `${transactionId}`,
                amount: providerAmount,
                status: TransactionStatus.SUCCESS,
                type: TransactionType.CREDIT,
            });
            const parts = input.parts?.map((rp) => ({
                name: rp.name,
                cost: Number(rp.cost),
            })) || [];

            const updateData = {
                status: BookingStatus.COMPLETED,
                esCrowAmout: 0,
                diagnosed: {
                    description: input.diagnose,
                    replaceParts: parts,
                },
                workProof: workProofUrls,
            };

            const updatedBooking = await this._bookingRepository.updateBooking(input.bookingId, updateData);
            if (!updatedBooking || !updatedBooking.workProof || !updatedBooking.diagnosed) throw { status: NOT_FOUND, message: NOT_FOUND_MSG };

            await this.sendCompletedWorkNotification({
                userId: updatedBooking.userId,
                title: "Service Completed",
                message: "Your booking has been marked as completed. Please review the service and share your feedback.",
                metadata: {
                    bookingId: updatedBooking.bookingId,
                    status: updatedBooking.status,
                    workProof: updatedBooking.workProof
                }
            });
            return {
                status: updatedBooking.status,
                workProofUrls: updatedBooking.workProof,
                diagnosed: {
                    description: updatedBooking.diagnosed.description,
                    replaceParts: updatedBooking.diagnosed.replaceParts
                },
            };

        } catch (error: any) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }

    }
}