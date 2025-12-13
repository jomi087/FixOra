import { Category } from "../../../../domain/entities/CategoryEntity";
import { UpdateCategoryInputDTO } from "../../../DTOs/CategoryDTO";

export interface IUpdateCategoryUseCase {
    execute(input: UpdateCategoryInputDTO): Promise<Category>
}