import { Category } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { IFileValidator } from "../../../domain/interface/ServiceInterface/IFileValidator";
import { IImageUploaderService } from "../../../domain/interface/ServiceInterface/IImageUploaderService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { UpdateCategoryInputDTO } from "../../DTOs/CategoryDTO";
import { IUpdateCategoryUseCase } from "../../Interface/useCases/Admin/IUpdateCategoryUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT } = HttpStatusCode;
const { INTERNAL_ERROR, CATEGORY_ALREADY_EXISTS } = Messages;

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _imageUploaderService: IImageUploaderService,
        private readonly _fileValidator: IFileValidator
    ) { }
    async execute(input: UpdateCategoryInputDTO): Promise<Category> {
        try {
            const { categoryId, description, imageFile, name } = input;

            const normalizedCategoryName = name.trim().toLowerCase();
            const existing = await this._categoryRepository.findByName(normalizedCategoryName);
            if (existing && existing.categoryId != categoryId) {
                throw { status: CONFLICT, message: CATEGORY_ALREADY_EXISTS };
            }

            let imageUrl: string | null = null;

            if (imageFile) {
                this._fileValidator.validate(imageFile);
                imageUrl = await this._imageUploaderService.uploadImage(imageFile.buffer, "FixOra/Services");
            }

            const updated = await this._categoryRepository.updateCategory(categoryId, {
                name,
                description,
                ...(imageUrl && { image: imageUrl }),
            });

            if (!updated) {
                throw { status: NOT_FOUND, message: "Id Not Found" };
            }

            return updated;

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}