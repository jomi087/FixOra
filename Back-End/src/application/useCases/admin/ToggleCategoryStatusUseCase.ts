import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IToggleCategoryStatusUseCase } from "../../Interface/useCases/admin/IToggleCategoryStatusUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class ToggleCategoryStatusUseCase implements IToggleCategoryStatusUseCase {
    constructor(
        private readonly _categoryRepository: ICategoryRepository
    ) { }

    async execute(categoryId: string): Promise<void> {
        try {
            const category = await this._categoryRepository.findById(categoryId);
            if (!category) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Category"));

            const newStatus = !category.isActive;

            // Update main category and all subcategories
            category.isActive = newStatus;
            category.subcategories = category.subcategories.map(sub => ({
                ...sub,
                isActive: newStatus
            }));

            //save
            await this._categoryRepository.save(category);

        } catch (error: unknown) {
            throw error;
        }
    }
}
