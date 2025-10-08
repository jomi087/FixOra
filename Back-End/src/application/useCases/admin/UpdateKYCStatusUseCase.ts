import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { KYCStatus } from "../../../shared/Enums/KYCstatus";
import { Messages } from "../../../shared/const/Messages";
import { RoleEnum } from "../../../shared/Enums/Roles";
import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../DTO's/UpdateKYCStatusDTO";
import { IUpdateKYCStatusUseCase } from "../../Interface/useCases/Admin/IUpdateKYCStatusUseCase";
import { v4 as uuidv4 } from "uuid";


const { INTERNAL_SERVER_ERROR,BAD_REQUEST,NOT_FOUND,CONFLICT } = HttpStatusCode;
const { INTERNAL_ERROR,INVALID_ACTION,KYC_REJECTED,USER_NOT_FOUND,PROVIDER_ALREADY_EXISTS,KYC_APPROVED,KYC_ALREADY_REVIEWED,KYC_NOT_FOUND  } = Messages;

export class UpdateKYCStatusUseCase implements IUpdateKYCStatusUseCase {
    constructor(
        private readonly _kycRequestRepository: IKYCRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _userRepository : IUserRepository
    ){ }
    
    private async update (id:string, request:KYCRequest) : Promise<void> {
        const updated = await this._kycRequestRepository.updateById(id, request);
        if (!updated) throw { status: NOT_FOUND, message: KYC_NOT_FOUND };
    }

    private validateIsPending(request: KYCRequest) {
        if (request.status !== KYCStatus.Pending) throw { status: CONFLICT, message: KYC_ALREADY_REVIEWED };
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
            throw { status: CONFLICT, message: PROVIDER_ALREADY_EXISTS };
        }

        request.status = KYCStatus.Approved;
        request.reviewedAt = new Date();
        await this.update(id, request);

        try {
            await this._providerRepository.create({
                providerId : uuidv4(),
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

            const updatedUser  = await this._userRepository.updateRole(request.userId, RoleEnum.Provider,["password","refreshToken","googleId","createdAt","isBlocked"]);
            
            if (!updatedUser) throw { status: NOT_FOUND, message: USER_NOT_FOUND };

            return KYC_APPROVED;

        } catch (error: any) {
            //if db error then roll back
            request.status = KYCStatus.Pending;
            request.reviewedAt = undefined;
            await this.update(id, request);
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR , message : INTERNAL_ERROR };
        }
    }

    async execute({ id, action, reason, adminId }: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO> {
        try {
            const request = await this._kycRequestRepository.findById(id);
            if (!request) throw { status: NOT_FOUND, message: KYC_NOT_FOUND };

            this.validateIsPending(request);
            request.reviewedBy = adminId;
            
            let message: string;
            if (action === KYCStatus.Rejected) {
                message = await this.rejectRequest(id, request, reason);
            } else if (action === KYCStatus.Approved) {
                message = await this.approveRequest(id, request);
            } else {
                throw { status: BAD_REQUEST, message: INVALID_ACTION };
            }
            return { id , message };
        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}


/* This is  how i wrote later  i splitter the code to make the execute loigc easy to understand 
    async execute({id,action,reason,adminId}:UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>{
        try {
            const request = await this.kycRequestRepository.findById(id)
            if (!request) throw { status: NOT_FOUND, message: KYC_NOT_FOUND }
            

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
                // const existingProvider = await this.providerRepository.findByUserId(request.userId);
                // if (existingProvider) {
                //     throw { status: CONFLICT, message: "Provider already exists for this user" };
                // }

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
*/