import { Category } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { IFileValidator } from "../../../domain/interface/ServiceInterface/IFileValidator";
import { IImageUploaderService } from "../../../domain/interface/ServiceInterface/IImageUploaderService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateCategoryInputDTO } from "../../dtos/CategoryDTO";
import { IUpdateCategoryUseCase } from "../../Interface/useCases/Admin/IUpdateCategoryUseCase";

const { NOT_FOUND, CONFLICT } = HttpStatusCode;
const { CATEGORY_ALREADY_EXISTS, NOT_FOUND_MSG } = Messages;

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
                throw new AppError(CONFLICT, CATEGORY_ALREADY_EXISTS);
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
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Category"));
            }

            return updated;

        } catch (error: unknown) {
            throw error;
        }
    }
}