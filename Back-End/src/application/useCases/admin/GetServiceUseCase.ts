import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

interface filters {
    searchQuery: string;
    filter: string;
    currentPage: number;
    limit : number;
}

const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages

export class GetServiceUseCase {
    constructor(
        private readonly categoryRepository : ICategoryRepository,

    ) {}
    
    async execute(input : filters ) {    
        try {

            const { searchQuery, filter, currentPage, limit } = input;

            const catogories = await this.categoryRepository.findServicesWithFilters({ searchQuery, filter },currentPage, limit)
            
            return {
                catogoriesData: catogories.data,
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


