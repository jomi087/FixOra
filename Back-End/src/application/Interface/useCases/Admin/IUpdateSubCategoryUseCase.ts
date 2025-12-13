import { Category } from "../../../../domain/entities/CategoryEntity";
import { UpdateSubCategoryInputDTO } from "../../../DTOs/CategoryDTO";

export interface IUpdateSubCategoryUseCase {
    execute(input: UpdateSubCategoryInputDTO): Promise<Category>
}
