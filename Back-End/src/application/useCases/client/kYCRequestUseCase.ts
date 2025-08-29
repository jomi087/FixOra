import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { KYCStatus } from "../../../shared/Enums/KYCstatus";
import { Messages } from "../../../shared/Messages";
import { KYCInputDTO } from "../../DTO's/KYCDTO";
import { IKYCRequestUseCase } from "../../Interface/useCases/Client/IKYCRequestUseCase";

const { BAD_REQUEST,INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { PENDING_KYC_REQUEST, KYC_ALREADY_APPROVED, INTERNAL_ERROR } = Messages;

export class KYCRequestUseCase implements IKYCRequestUseCase {
    constructor(
        private readonly _kycRequestRepository : IKYCRequestRepository
    ) { }
    
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
            
            return "submitted";
            
        } catch (error :any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

