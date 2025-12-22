import { Category } from "../../../../domain/entities/CategoryEntity";
import { UpdateCategoryInputDTO } from "../../../dto/CategoryDTO";

export interface IUpdateCategoryUseCase {
    execute(input: UpdateCategoryInputDTO): Promise<Category>
}