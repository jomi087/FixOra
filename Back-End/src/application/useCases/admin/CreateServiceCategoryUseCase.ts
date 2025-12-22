import { ICategoryRepository } from "../../../domain/interface/repositoryInterface/ICategoryRepository";
import { v4 as uuidv4 } from "uuid";
import { HttpStatusCode } from "../../../shared/enumss/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { ICreateServiceCategoryUseCase } from "../../Interface/useCases/admin/ICreateServiceCategoryUseCase";
import { AppError } from "../../../shared/errors/AppError";

export interface SubcategoryInputDTO {
    name: string;
    description: string;
    image: string;
}

export interface CategoryInputDTO {
    name: string;
    description: string;
    image: string;
    subcategories: SubcategoryInputDTO[];
}

const { BAD_REQUEST } = HttpStatusCode;
const { CATEGORY_ALREADY_EXISTS } = Messages;

export class CreateServiceCategoryUseCase implements ICreateServiceCategoryUseCase {
    constructor(
        private readonly _categoryRepository: ICategoryRepository
    ) { }

    async execute(input: CategoryInputDTO): Promise<void> {
        try {
            const { name, description, subcategories, image } = input;

            const normalizedCategoryName = name.trim().toLowerCase();
            const exists = await this._categoryRepository.findByName(normalizedCategoryName);
            if (exists) {
                throw new AppError(BAD_REQUEST, CATEGORY_ALREADY_EXISTS);
            }

            const category = {
                categoryId: uuidv4(),
                name: normalizedCategoryName,
                description,
                image,
                isActive: false,
                subcategories: subcategories.map(sub => ({
                    subCategoryId: uuidv4(),
                    isActive: false,
                    ...sub,
                })),
            };
            await this._categoryRepository.create(category);
        } catch (error: unknown) {
            throw error;
        }
    }
}
