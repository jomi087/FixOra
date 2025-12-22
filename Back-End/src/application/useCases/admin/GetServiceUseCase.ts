import { ICategoryRepository } from "../../../domain/interface/repositoryInterfaceTempName/ICategoryRepository";
import { GetServicesInputDTO, GetServicesOutputDTO } from "../../dtos/CategoryDTO";
import { IGetServiceUseCase } from "../../Interface/useCases/admin/IGetServiceUseCase";

export class GetServiceUseCase implements IGetServiceUseCase {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,

    ) { }

    async execute(input: GetServicesInputDTO): Promise<GetServicesOutputDTO> {
        try {

            const { searchQuery, filter, currentPage, limit } = input;

            const categories = await this._categoryRepository.findServicesWithFilters({ searchQuery, filter }, currentPage, limit);

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
                total: categories.total
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}


