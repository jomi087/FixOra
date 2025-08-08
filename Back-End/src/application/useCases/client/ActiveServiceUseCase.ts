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
            
            return categories

        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR , message: INTERNAL_ERROR };
        }
    }

}