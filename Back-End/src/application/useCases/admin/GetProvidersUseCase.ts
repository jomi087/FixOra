import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../DTO's/GetProviderDTO";
import { IGetProvidersUseCase } from "../../Interface/useCases/Admin/IGetProvidersUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetProvidersUseCase implements IGetProvidersUseCase {
    constructor(
        private readonly _providerRepository : IProviderRepository,

    ) {}
    
    async execute(input: GetProvidersInputDTO ):Promise<GetProvidersOutputDTO> {
        
        try {
            const { searchQuery, filter, currentPage, limit } = input;

            const { data, total } = await this._providerRepository.findProvidersWithFilters({ searchQuery, filter }, currentPage, limit );
            
            return { data ,total };
            
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}