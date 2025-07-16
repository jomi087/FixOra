import { KYCRequest } from "../../../domain/entities/KYCRequestEntity.js";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository.js";
import { KYCStatus } from "../../../shared/constant/KYCstatus.js";
import { KYCInputDTO } from "../../InputDTO's/KYCInputDTO.js";

export class KYCRequestUseCase {
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
                throw { status: 400, message: "You already have a pending KYC request. Please wait for admin review." };
            }
            if (existing.status === KYCStatus.Approved) {
                throw { status: 400, message: "Your KYC is already approved. No need to reapply." };
            }
            if (existing.status === KYCStatus.Rejected) {
                await this.kycRequestRepository.update(input.userId, newRequest) as KYCRequest;
                return "resubmitted"
            }
        }
        await this.kycRequestRepository.create(newRequest) 
        return "submitted"
    }
}

