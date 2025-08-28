import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { ActiveCategoryOutputDTO } from "../../DTO's/CategoryDTO";
import { IActiveServiceUseCase } from "../../Interface/useCases/Client/IActiveServiceUseCase";

const { INTERNAL_SERVER_ERROR} = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class ActiveServiceUseCase implements IActiveServiceUseCase {
    constructor(
        private readonly _categoryRepository : ICategoryRepository
    ) { }
    
    async execute():Promise<ActiveCategoryOutputDTO[]> {
        try {
            const categories = await this._categoryRepository.findActiveCategoriesWithActiveSubcategories()
                        
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