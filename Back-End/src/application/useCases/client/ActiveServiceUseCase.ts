import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";

const { INTERNAL_SERVER_ERROR} = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class ActiveServiceUseCase {
    constructor(
        private readonly categoryRepository : ICategoryRepository
    ) { }
    
    async execute() {
        try {
            const categories = await this.categoryRepository.findActiveCategoriesWithActiveSubcategories()
                        
                const mappedData = categories.map((cat) => ({
                    categoryId: cat.categoryId,
                    name: cat.name,
                    description: cat.description,
                    image: cat.image,
                    isActive: cat.isActive,
                    subcategories: cat.subcategories.map((sub) => ({
                        subCategoryId: sub.subCategoryId,
                        name: sub.name,
                        description: sub.description,
                        image: sub.image,
                        isActive: sub.isActive,
                    })),
                }));


            return mappedData

        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR , message: INTERNAL_ERROR };
        }
    }

}