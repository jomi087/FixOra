import { Category } from "../../../../domain/entities/CategoryEntity";
import { UpdateCategoryInputDTO } from "../../../dtos/CategoryDTO";

export interface IUpdateCategoryUseCase {
    execute(input: UpdateCategoryInputDTO): Promise<Category>
}