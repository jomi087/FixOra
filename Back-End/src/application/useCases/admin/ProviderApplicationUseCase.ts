import { KYCRequestWithDetails } from "../../../domain/entities/KYCRequestEntity.js";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { ProviderApplicationDTO, ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../DTO's/ProviderApplicationDTO.js";
import { IProviderApplicationUseCase } from "../../Interface/useCases/Admin/IProviderApplicationUseCase.js";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class ProviderApplicationUseCase implements IProviderApplicationUseCase{
    constructor(
        private readonly kycRequestRepository : IKYCRequestRepository
    ) { }
    
    async execute(input: ProviderApplicationInputDTO):Promise<ProviderApplicationOutputDTO> {
        try {
            const { searchQuery, filter, currentPage, limit } = input
            
            const { data, total } = await this.kycRequestRepository.findWithFilters({ searchQuery, filter }, currentPage, limit)
            
            return { data,total } 

        } catch (error: any) {
            // console.log("check error",error)
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}