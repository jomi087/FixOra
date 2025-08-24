import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { v4 as uuidv4 } from "uuid";
// import { CategoryInputDTO } from "../../DTO's/CategoryInputDTO.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { ICreateServiceCategoryUseCase } from "../../Interface/useCases/Admin/ICreateServiceCategoryUseCase.js";

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

const { BAD_REQUEST } = HttpStatusCode
const { CATEGORY_ALREADY_EXISTS} = Messages

export class CreateServiceCategoryUseCase implements ICreateServiceCategoryUseCase {
  constructor(
    private readonly _categoryRepository: ICategoryRepository
  ) {}

  async execute(input: CategoryInputDTO): Promise<void> {
    const { name, description, subcategories, image } = input;

    const normalizedCategoryName = name.trim().toLowerCase();
    const exists = await this._categoryRepository.findByName(normalizedCategoryName);
    if (exists) {
      throw { status: BAD_REQUEST, message: CATEGORY_ALREADY_EXISTS  };
    }

    const category = {
      categoryId: uuidv4(),
      name: normalizedCategoryName,
      description,
      image,
      isActive:false,
      subcategories: subcategories.map(sub => ({
        subCategoryId: uuidv4(),
        isActive:false,
        ...sub,
      })),
    };

    // Save category
    await this._categoryRepository.create(category);
  }
}
