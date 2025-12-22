import { Category } from "../../../../domain/entities/CategoryEntity";
import { UpdateSubCategoryInputDTO } from "../../../dto/CategoryDTO";

export interface IUpdateSubCategoryUseCase {
    execute(input: UpdateSubCategoryInputDTO): Promise<Category>
}
