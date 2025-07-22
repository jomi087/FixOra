import { KYCRequestWithDetails } from "../../../domain/entities/KYCRequestEntity.js";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { ProviderApplicationDTO } from "../../DTO's/ProviderApplicationDTO.js";

interface filters {
    searchQuery: string;
    filter: string;
    currentPage: number;
    limit : number;
}

const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class ProviderApplicationUseCase {
    constructor(
        private readonly kycRequestRepository : IKYCRequestRepository
    ) { }
    
    async execute(input: filters) {
        try {
            const { searchQuery, filter, currentPage, limit } = input
            
            const { data, total } = await this.kycRequestRepository.findWithFilters({ searchQuery, filter }, currentPage, limit)
            
            const mappedData: ProviderApplicationDTO[] = data.map((doc:KYCRequestWithDetails) => {
                const specializationNames = doc.service.subcategories
                    .filter((sub) => (doc.specializationIds.includes(sub.subCategoryId)))
                    .map((sub: any) => sub.name)
                return {
                    id: doc.id,
                    user: {
                        fname: doc.user.fname,
                        lname: doc.user.lname,
                        email: doc.user.email,
                        mobileNo: doc.user.mobileNo,
                        location:doc.user.location 
                    },
                    dob: doc.dob,
                    gender: doc.gender,
                    serviceName: doc.service.name,
                    specializationNames ,
                    profileImage: doc.profileImage,
                    serviceCharge: doc.serviceCharge,
                    kyc: {
                        idCard: doc.kyc.idCard,
                        certificate: {
                            education: doc.kyc.certificate.education ,
                            experience: doc.kyc.certificate?.experience 
                        }
                    },
                    status: doc.status,
                    reason: doc.reason ,
                    submittedAt: doc.submittedAt,
                    reviewedAt: doc.reviewedAt ,
                    reviewedBy: doc.reviewedBy ,
                }
            })

            return { data:mappedData ,total } 

        } catch (error: any) {
            // console.log("check error",error)
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}