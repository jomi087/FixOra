import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";

export class ToggleCategoryStatusUseCase {
    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(categoryId: string): Promise<void> {
        try {
            const category = await this.categoryRepository.findById(categoryId);
            console.log("mainCategory", category)

            const newStatus = !category.isActive;

            // Update main category and all subcategories
            category.isActive = newStatus;
            category.subcategories = category.subcategories.map(sub => ({
                ...sub,
                isActive: newStatus
            }));

            //save
            await this.categoryRepository.save(category);
    
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'updating status failed, (something went wrong)'};
        }
    }
}
