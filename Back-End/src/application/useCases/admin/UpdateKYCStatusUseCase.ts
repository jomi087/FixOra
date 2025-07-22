import { KYCRequest } from "../../../domain/entities/KYCRequestEntity.js";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository.js";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { KYCStatus } from "../../../shared/constant/KYCstatus.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../DTO's/UpdateKYCStatusDTO.js";
import { IUpdateKYCStatusUseCase } from "../../Interface/useCases/Admin/IUpdateKYCStatusUseCase.js";


const { INTERNAL_SERVER_ERROR,BAD_REQUEST,NOT_FOUND,CONFLICT} = HttpStatusCode
const { INTERNAL_ERROR,INVALID_ACTION,KYC_REJECTED,KYC_APPROVED,KYC_ALREADY_REVIEWED,KYC_NOT_FOUND  } = Messages

export class UpdateKYCStatusUseCase implements IUpdateKYCStatusUseCase {
    constructor(
        private readonly kycRequestRepository: IKYCRequestRepository,
        private readonly providerRepository : IProviderRepository
    )
    { }
    
    private async update (id:string, request:KYCRequest) : Promise<void> {
        const updated = await this.kycRequestRepository.updateById(id, request);
        if (!updated) throw { status: NOT_FOUND, message: KYC_NOT_FOUND };
    }

    async execute({id,action,reason,adminId}:UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>{
        try {
            const request = await this.kycRequestRepository.findById(id)
            if(!request) throw { status : NOT_FOUND , message : KYC_NOT_FOUND }

            if(request.status !== KYCStatus.Pending) throw { status : CONFLICT , message : KYC_ALREADY_REVIEWED }

            const now = new Date();

            if (action === KYCStatus.Rejected) {
                request.status = KYCStatus.Rejected;
                request.reason = reason;
                request.reviewedAt = now;
                request.reviewedBy = adminId;
            
                await this.update(id, request)

                return { message: KYC_REJECTED };
            }

            if (action === KYCStatus.Approved) {
                request.status = KYCStatus.Approved;
                request.reviewedAt = now;
                request.reviewedBy = adminId;

                await this.update(id, request)

                await this.providerRepository.create( {
                  userId: request.userId,
                  dob: request.dob,
                  gender: request.gender,
                  serviceId: request.serviceId,
                  specializationIds: request.specializationIds, 
                  profileImage: request.profileImage,
                  serviceCharge: request.serviceCharge,
                  kyc: request.kyc,
                  isOnline: false,
                })
                return { message : KYC_APPROVED }
            }

            throw { status : BAD_REQUEST , message : INVALID_ACTION }  

        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }

    }
}