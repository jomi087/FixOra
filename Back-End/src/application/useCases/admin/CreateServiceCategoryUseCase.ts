import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { v4 as uuidv4 } from "uuid";
import { CategoryInputDTO } from "../../DTO's/CategoryInputDTO.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

const { BAD_REQUEST } = HttpStatusCode
const { CATEGORY_ALREADY_EXISTS} = Messages

export class CreateServiceCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: CategoryInputDTO): Promise<void> {
    const { name, description, subcategories, image } = input;

    const normalizedCategoryName = name.trim().toLowerCase();
    const exists = await this.categoryRepository.findByName(normalizedCategoryName);
    if (exists) {
      throw { status: BAD_REQUEST, message: CATEGORY_ALREADY_EXISTS  };
    }

    const category = {
      categoryId: uuidv4(),
      name: normalizedCategoryName,
      description,
      image,
      subcategories: subcategories.map(sub => ({
        subCategoryId: uuidv4(),
        ...sub,
      })),
    };

    // Save category
    await this.categoryRepository.create(category);
  }
}
