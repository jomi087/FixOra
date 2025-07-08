import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";

export class GetLandingDataUseCase{
    constructor(
        private readonly categoryRepository : ICategoryRepository
    ) { }
    
    async execute() {
        try {
            const categories = await this.categoryRepository.findActiveCategories(["subcategories"])
            // top 5 providers image data  will add later  
            //top 6 blogs  data
            return {
                categories
                //providers
                //blogs
            }
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'Fetching Main Categories data failed, (something went wrong)'};
        }
    }
}