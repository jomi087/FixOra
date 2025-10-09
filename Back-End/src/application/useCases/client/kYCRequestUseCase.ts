import { v4 as uuidv4 } from "uuid";

import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { KYCStatus } from "../../../shared/Enums/KYCstatus";
import { RoleEnum } from "../../../shared/Enums/Roles";
import { Messages } from "../../../shared/const/Messages";
import { KYCInputDTO } from "../../DTO's/KYCDTO";
import { IKYCRequestUseCase } from "../../Interface/useCases/Client/IKYCRequestUseCase";
import { NotificationType } from "../../../shared/Enums/Notification";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { PENDING_KYC_REQUEST, KYC_ALREADY_APPROVED, INTERNAL_ERROR, USER_NOT_FOUND } = Messages;

export class KYCRequestUseCase implements IKYCRequestUseCase {
    constructor(
        private readonly _kycRequestRepository: IKYCRequestRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _notificationRepository: INotificationRepository,
        private readonly _notificationService: INotificationService,
    ) { }

    private async sendKYCRequestNotification(userId: string): Promise<void> {
        try {

            const user = await this._userRepository.findByUserId(userId);
            if (!user) throw { status: NOT_FOUND, message: USER_NOT_FOUND };

            const admins = await this._userRepository.findByRole(RoleEnum.Admin);

            const notifications = admins.map(admin => ({
                notificationId: uuidv4(),
                userId: admin.userId,
                type: NotificationType.KYC_REQUEST,
                title: "New Provider Request",
                message: `${user.fname} has submitted a request to become a provider.`,
                isRead: false,
                createdAt: new Date(),
            }));

            await this._notificationRepository.saveMany(notifications);

            const payload = {
                // notificationId: notification.notificationId,
                type: NotificationType.KYC_REQUEST,
                title: "New Provider Request",
                message: `${user.fname} has submitted a request to become a provider.`,
                createdAt: new Date(),
                isRead: false,
            };
            await this._notificationService.sendToRole(RoleEnum.Admin, payload);


        } catch (error) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }


    async execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted"> {
        try {
            const existing = await this._kycRequestRepository.findByUserId(input.userId);

            const newRequest: KYCRequest = {
                userId: input.userId,
                dob: new Date(input.dob),
                gender: input.gender,
                serviceId: input.serviceId,
                specializationIds: input.specializationIds,
                profileImage: input.profileImage,
                serviceCharge: input.serviceCharge,
                kyc: input.kyc,
                status: KYCStatus.Pending,
                submittedAt: new Date(),
            };

            if (existing) {
                if (existing.status === KYCStatus.Pending) {
                    throw { status: BAD_REQUEST, message: PENDING_KYC_REQUEST };
                }
                if (existing.status === KYCStatus.Approved) {
                    throw { status: BAD_REQUEST, message: KYC_ALREADY_APPROVED };
                }
                if (existing.status === KYCStatus.Rejected) {
                    await this._kycRequestRepository.updateByUserId(input.userId, newRequest) as KYCRequest;
                    return "resubmitted";
                }
            }

            await this._kycRequestRepository.create(newRequest);
            await this.sendKYCRequestNotification(input.userId);
            return "submitted";

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

