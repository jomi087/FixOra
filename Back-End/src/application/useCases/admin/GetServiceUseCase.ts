import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { GetServicesInputDTO, GetServicesOutputDTO } from "../../DTO's/GetServiceDTO.js";
import { IGetServiceUseCase } from "../../Interface/useCases/Admin/IGetServiceUseCase.js";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages

export class GetServiceUseCase implements IGetServiceUseCase {
    constructor(
        private readonly categoryRepository : ICategoryRepository,

    ) {}
    
    async execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO > {    
        try {

            const { searchQuery, filter, currentPage, limit } = input;

            const catogories = await this.categoryRepository.findServicesWithFilters({ searchQuery, filter },currentPage, limit)
            
            return {
                data: catogories.data,
                total : catogories.total
            };

        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}


