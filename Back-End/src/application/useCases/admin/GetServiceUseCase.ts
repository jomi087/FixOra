import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";

interface filters {
  searchQuery: string;
  filter: string;
  currentPage: number;
  limit : number;
}


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
            throw { status: 500, message: 'Fetching Customer data failed, (something went wrong)'};
        }
    }
}


