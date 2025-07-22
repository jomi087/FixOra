import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

const { INTERNAL_SERVER_ERROR} = HttpStatusCode
const { INTERNAL_ERROR } = Messages

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
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}