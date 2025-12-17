import { Category } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";
import { IFileValidator } from "../../../domain/interface/serviceInterface/IFileValidator";
import { IImageUploaderService } from "../../../domain/interface/serviceInterface/IImageUploaderService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateSubCategoryInputDTO } from "../../dtos/CategoryDTO";
import { IUpdateSubCategoryUseCase } from "../../Interface/useCases/admin/IUpdateSubCategoryUseCase";

const {  NOT_FOUND, CONFLICT } = HttpStatusCode;
const {  NOT_FOUND_MSG, ALREADY_EXISTS_MSG } = Messages;

export class UpdateSubCategoryUseCase implements IUpdateSubCategoryUseCase {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _imageUploaderService: IImageUploaderService,
        private readonly _fileValidator: IFileValidator

    ) { }
    async execute(input: UpdateSubCategoryInputDTO): Promise<Category> {
        try {
            const { subCategoryId, description, imageFile, name } = input;

            const parent = await this._categoryRepository.findCategoryBySubCategoryId(subCategoryId);
            if (!parent) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Category"));
            }

            const normalizedNewName = name.trim().toLowerCase();

            const duplicate = parent.subcategories.find(sub =>
                sub.subCategoryId !== subCategoryId &&
                sub.name.trim().toLowerCase() === normalizedNewName
            );

            if (duplicate) {
                throw new AppError(CONFLICT, ALREADY_EXISTS_MSG("Subcategory"));
            }

            let imageUrl: string | null = null;

            if (imageFile) {
                this._fileValidator.validate(imageFile);
                imageUrl = await this._imageUploaderService.uploadImage(imageFile.buffer, "FixOra/Services");
            }


            const updated = await this._categoryRepository.updateSubCategory(subCategoryId, {
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