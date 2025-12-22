import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { IKYCRequestRepository } from "../../../domain/interface/repositoryInterfaceTempName/IKYCRequestRepository";
import { IProviderRepository } from "../../../domain/interface/repositoryInterfaceTempName/IProviderRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterfaceTempName/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { KYCStatus } from "../../../shared/enums/KYCstatus";
import { Messages } from "../../../shared/const/Messages";
import { RoleEnum } from "../../../shared/enums/Roles";
import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../dtos/UpdateKYCStatusDTO";
import { IUpdateKYCStatusUseCase } from "../../Interface/useCases/admin/IUpdateKYCStatusUseCase";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../../shared/errors/AppError";


const { BAD_REQUEST, NOT_FOUND, CONFLICT } = HttpStatusCode;
const { INVALID_ACTION, KYC_REJECTED, NOT_FOUND_MSG, PROVIDER_ALREADY_EXISTS, KYC_APPROVED, KYC_ALREADY_REVIEWED, KYC_NOT_FOUND } = Messages;

export class UpdateKYCStatusUseCase implements IUpdateKYCStatusUseCase {
    constructor(
        private readonly _kycRequestRepository: IKYCRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _userRepository: IUserRepository
    ) { }

    private async update(id: string, request: KYCRequest): Promise<void> {
        const updated = await this._kycRequestRepository.updateById(id, request);
        if (!updated) throw new AppError(NOT_FOUND, KYC_NOT_FOUND);
    }

    private validateIsPending(request: KYCRequest) {
        if (request.status !== KYCStatus.Pending) throw new AppError(CONFLICT, KYC_ALREADY_REVIEWED);
    }

    private async rejectRequest(id: string, request: KYCRequest, reason?: string): Promise<string> {

        request.status = KYCStatus.Rejected;
        request.reason = reason;
        request.reviewedAt = new Date();

        await this.update(id, request);

        return KYC_REJECTED;
    }

    private async approveRequest(id: string, request: KYCRequest): Promise<string> {

        const existingProvider = await this._providerRepository.findByUserId(request.userId);
        if (existingProvider) {
            throw new AppError(CONFLICT, PROVIDER_ALREADY_EXISTS);
        }

        request.status = KYCStatus.Approved;
        request.reviewedAt = new Date();
        await this.update(id, request);

        try {
            await this._providerRepository.create({
                providerId: uuidv4(),
                userId: request.userId,
                dob: request.dob,
                gender: request.gender,
                serviceId: request.serviceId,
                specializationIds: request.specializationIds,
                profileImage: request.profileImage,
                serviceCharge: request.serviceCharge,
                kyc: request.kyc,
                isOnline: false,
            });

            const updatedUser = await this._userRepository.updateRole(request.userId, RoleEnum.Provider, ["password", "refreshToken", "googleId", "createdAt", "isBlocked"]);

            if (!updatedUser) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));


            return KYC_APPROVED;

        } catch (error: unknown) {
            //if db error then roll back
            request.status = KYCStatus.Pending;
            request.reviewedAt = undefined;
            await this.update(id, request);
            throw error;
        }
    }

    async execute({ id, action, reason, adminId }: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO> {
        try {
            const request = await this._kycRequestRepository.findById(id);
            if (!request) throw new AppError(NOT_FOUND, KYC_NOT_FOUND);

            this.validateIsPending(request);
            request.reviewedBy = adminId;

            let message: string;
            if (action === KYCStatus.Rejected) {
                message = await this.rejectRequest(id, request, reason);
            } else if (action === KYCStatus.Approved) {
                message = await this.approveRequest(id, request);
            } else {
                throw new AppError(BAD_REQUEST, INVALID_ACTION);
            }
            return { id, message };
        } catch (error: unknown) {
            throw error;
        }
    }

}

