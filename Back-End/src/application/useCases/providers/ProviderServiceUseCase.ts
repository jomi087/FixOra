import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";
import { IProviderRepository } from "../../../domain/interface/repositoryInterface/IProviderRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { ShortCategoryOutputDTO } from "../../dto/CategoryDTO";
import { IProviderServiceUseCase } from "../../interface/useCases/provider/IProviderServiceUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class ProviderServiceUseCase implements IProviderServiceUseCase {

    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _categoryRepository: ICategoryRepository
    ) { }

    async execute(providerUserId: string): Promise<ShortCategoryOutputDTO> {

        try {
            const categoryId = await this._providerRepository.findServiceId(providerUserId);
            if (!categoryId) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));

            const category = await this._categoryRepository.findById(categoryId);
            if (!category) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Services"));
            const mappedData: ShortCategoryOutputDTO = {
                categoryId: category.categoryId,
                name: category.name,
                subcategories: category.subcategories.map((sub) => ({
                    subCategoryId: sub.subCategoryId,
                    name: sub.name
                }))
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}