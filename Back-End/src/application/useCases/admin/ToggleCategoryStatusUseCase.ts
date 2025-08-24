import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { IToggleCategoryStatusUseCase } from "../../Interface/useCases/Admin/IToggleCategoryStatusUseCase.js";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages

export class ToggleCategoryStatusUseCase implements IToggleCategoryStatusUseCase{
    constructor(
        private readonly _categoryRepository: ICategoryRepository
    ) { }

    async execute(categoryId: string): Promise<void> {
        try {
            const category = await this._categoryRepository.findById(categoryId);
            console.log("mainCategory", category)

            const newStatus = !category.isActive;

            // Update main category and all subcategories
            category.isActive = newStatus;
            category.subcategories = category.subcategories.map(sub => ({
                ...sub,
                isActive: newStatus
            }));

            //save
            await this._categoryRepository.save(category);
    
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
