import { Category } from "../../../../domain/entities/CategoryEntity";
import { UpdateSubCategoryInputDTO } from "../../../dtos/CategoryDTO";

export interface IUpdateSubCategoryUseCase {
    execute(input: UpdateSubCategoryInputDTO): Promise<Category>
}
