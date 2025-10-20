import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { ShortCategoryOutputDTO } from "../../DTOs/CategoryDTO";
import { IProviderServiceUseCase } from "../../Interface/useCases/Provider/IProviderServiceUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND, CATEGORY_NOT_FOUND } = Messages;

export class ProviderServiceUseCase implements IProviderServiceUseCase {

    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _categoryRepository: ICategoryRepository
    ) { }

    async execute(providerUserId: string): Promise<ShortCategoryOutputDTO> {

        try {
            const categoryId = await this._providerRepository.findServiceId(providerUserId);
            if (!categoryId) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            const category = await this._categoryRepository.findById(categoryId);
            if (!category) throw { status: NOT_FOUND, message: CATEGORY_NOT_FOUND };

            const mappedData: ShortCategoryOutputDTO = {
                categoryId: category.categoryId,
                name: category.name,
                subcategories: category.subcategories.map((sub) => ({
                    subCategoryId: sub.subCategoryId,
                    name: sub.name
                }))
            };

            return mappedData;

        } catch (error) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}