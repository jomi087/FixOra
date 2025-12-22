import { v4 as uuidv4 } from "uuid";

import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { IKYCRequestRepository } from "../../../domain/interface/repositoryInterface/IKYCRequestRepository";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { KYCStatus } from "../../../shared/enums/KYCstatus";
import { RoleEnum } from "../../../shared/enums/Roles";
import { Messages } from "../../../shared/const/Messages";
import { KYCInputDTO } from "../../dto/KYCDTO";
import { IKYCRequestUseCase } from "../../interface/useCases/client/IKYCRequestUseCase";
import { NotificationType } from "../../../shared/enums/Notification";
import { IImageUploaderService } from "../../../domain/interface/serviceInterface/IImageUploaderService";
import { AppError } from "../../../shared/errors/AppError";

const { BAD_REQUEST, NOT_FOUND } = HttpStatusCode;
const { PENDING_KYC_REQUEST, KYC_ALREADY_APPROVED, NOT_FOUND_MSG } = Messages;

export class KYCRequestUseCase implements IKYCRequestUseCase {
    constructor(
        private readonly _imageUploaderService: IImageUploaderService,
        private readonly _kycRequestRepository: IKYCRequestRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _notificationRepository: INotificationRepository,
        private readonly _notificationService: INotificationService,
    ) { }

    private async sendKYCRequestNotification(userId: string): Promise<void> {
        try {

            const user = await this._userRepository.findByUserId(userId);
            if (!user) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));


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


        } catch (error: unknown) {
            throw error;
        }
    }


    async execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted"> {
        try {
            const upload = async (key: string) => {
                const file = input.files[key]?.[0];
                if (!file) return undefined;
                return await this._imageUploaderService.uploadImage(
                    file.buffer,
                    `FixOra/Provider/${input.name}/${key}`
                );
            };

            const profileImageUrl = await upload("profileImage");
            const idCardUrl = await upload("idCard");
            const educationCertUrl = await upload("educationCertificate");
            const experienceCertUrl = await upload("experienceCertificate");

            const existing = await this._kycRequestRepository.findByUserId(input.userId);

            const newRequest: KYCRequest = {
                userId: input.userId,
                dob: new Date(input.dob),
                gender: input.gender,
                serviceId: input.serviceId,
                specializationIds: input.specializationIds,
                profileImage: profileImageUrl!,
                serviceCharge: input.serviceCharge,
                kyc: {
                    idCard: idCardUrl!,
                    certificate: {
                        education: educationCertUrl!,
                        experience: experienceCertUrl!,
                    },
                },
                status: KYCStatus.Pending,
                submittedAt: new Date(),
            };

            if (existing) {
                if (existing.status === KYCStatus.Pending) {
                    throw new AppError(BAD_REQUEST, PENDING_KYC_REQUEST);
                }
                if (existing.status === KYCStatus.Approved) {
                    throw new AppError(BAD_REQUEST, KYC_ALREADY_APPROVED);
                }
                if (existing.status === KYCStatus.Rejected) {
                    await this._kycRequestRepository.updateByUserId(input.userId, newRequest) as KYCRequest;
                    return "resubmitted";
                }
            }

            await this._kycRequestRepository.create(newRequest);
            await this.sendKYCRequestNotification(input.userId);
            return "submitted";

        } catch (error: unknown) {
            throw error;
        }
    }
}

