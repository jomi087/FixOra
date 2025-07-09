import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";

export class ActiveServiceUseCase {
    constructor(
        private readonly categoryRepository : ICategoryRepository
    ) { }
    
    async execute() {
        try {
            const categories = await this.categoryRepository.findActiveCategoriesWithActiveSubcategories()
            
            return categories

        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: 500, message: 'Fetching Categories data failed, (something went wrong)'};
        }
    }

}