import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { GetServicesInputDTO, GetServicesOutputDTO } from "../../DTOs/GetServiceDTO";
import { IGetServiceUseCase } from "../../Interface/useCases/Admin/IGetServiceUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetServiceUseCase implements IGetServiceUseCase {
    constructor(
        private readonly _categoryRepository : ICategoryRepository,

    ) {}
    
    async execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO > {    
        try {

            const { searchQuery, filter, currentPage, limit } = input;

            const categories = await this._categoryRepository.findServicesWithFilters({ searchQuery, filter },currentPage, limit);
            
            const mappedData = categories.data.map((cat) => ({
                categoryId: cat.categoryId,
                name: cat.name,
                description: cat.description,
                image: cat.image,
                isActive: cat.isActive,
                subcategories: cat.subcategories?.map((subCat) => ({
                    subCategoryId: subCat.subCategoryId,
                    name: subCat.name,
                    description: subCat.description,
                    image: subCat.image,
                    isActive: subCat.isActive,
                })) ?? []
            }));

            return {
                data: mappedData,
                total : categories.total
            };

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}


