import { KYCRequest } from "../../../domain/entities/KYCRequestEntity.js";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { KYCStatus } from "../../../shared/Enums/KYCstatus.js";
import { Messages } from "../../../shared/Messages.js";
import { KYCInputDTO } from "../../DTO's/KYCDTO.js";
import { IKYCRequestUseCase } from "../../Interface/useCases/Client/IKYCRequestUseCase.js";

const { BAD_REQUEST} = HttpStatusCode
const { PENDING_KYC_REQUEST, KYC_ALREADY_APPROVED } = Messages

export class KYCRequestUseCase implements IKYCRequestUseCase {
    constructor(
        private readonly kycRequestRepository : IKYCRequestRepository
    ) { }
    
    async execute(input: KYCInputDTO): Promise<"submitted" | "resubmitted"> {

        const existing = await this.kycRequestRepository.findByUserId(input.userId)
        
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
                await this.kycRequestRepository.updateByUserId(input.userId, newRequest) as KYCRequest;
                return "resubmitted"
            }
        }
        
        await this.kycRequestRepository.create(newRequest)
        

        return "submitted"
    }
}

