import { CreateCategoryInputDTO } from "../../../dtos/CategoryDTO";

export interface ICreateServiceCategoryUseCase{
    execute(input : CreateCategoryInputDTO ):Promise<void>
} 