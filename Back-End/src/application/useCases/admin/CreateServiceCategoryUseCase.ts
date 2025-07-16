import { ICategoryRepository } from "../../../domain/interface/RepositoryInterface/ICategoryRepository.js";
import { v4 as uuidv4 } from "uuid";
import { CategoryInputDTO } from "../../InputDTO's/CategoryInputDTO.js";

export class CreateServiceCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(input: CategoryInputDTO): Promise<void> {
    const { name, description, subcategories, image } = input;

    const normalizedCategoryName = name.trim().toLowerCase();
    const exists = await this.categoryRepository.findByName(normalizedCategoryName);
    if (exists) {
      throw { status: 400, message: `Category "${name}" already exists.` };
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
