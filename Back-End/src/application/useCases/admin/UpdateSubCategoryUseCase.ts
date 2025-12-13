import { Category } from "../../../domain/entities/CategoryEntity";
import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository";
import { IFileValidator } from "../../../domain/interface/ServiceInterface/IFileValidator";
import { IImageUploaderService } from "../../../domain/interface/ServiceInterface/IImageUploaderService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { UpdateSubCategoryInputDTO } from "../../DTOs/CategoryDTO";
import { IUpdateSubCategoryUseCase } from "../../Interface/useCases/Admin/IUpdateSubCategoryUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

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
                throw { status: NOT_FOUND, message: "Parent category not found" };
            }

            const normalizedNewName = name.trim().toLowerCase();

            const duplicate = parent.subcategories.find(sub =>
                sub.subCategoryId !== subCategoryId &&
                sub.name.trim().toLowerCase() === normalizedNewName
            );

            if (duplicate) {
                throw { status: CONFLICT, message: "Subcategory already exists" };
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