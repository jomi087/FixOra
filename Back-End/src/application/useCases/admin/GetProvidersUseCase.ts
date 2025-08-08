import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../DTO's/GetProviderDTO.js";
import { IGetProvidersUseCase } from "../../Interface/useCases/Admin/IGetProvidersUseCase.js";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR} = Messages

export class GetProvidersUseCase implements IGetProvidersUseCase {
    constructor(
        private readonly providerRepository : IProviderRepository,

    ) {}
    
    async execute(input: GetProvidersInputDTO ):Promise<GetProvidersOutputDTO> {
        
        try {
            const { searchQuery, filter, currentPage, limit } = input

            const { data, total } = await this.providerRepository.findProvidersWithFilters({ searchQuery, filter }, currentPage, limit )
            
            return { data ,total };
            
        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}