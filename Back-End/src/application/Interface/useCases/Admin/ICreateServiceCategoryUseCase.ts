import { CreateCategoryInputDTO } from "../../../DTOs/CategoryDTO";

export interface ICreateServiceCategoryUseCase{
    execute(input : CreateCategoryInputDTO ):Promise<void>
} 