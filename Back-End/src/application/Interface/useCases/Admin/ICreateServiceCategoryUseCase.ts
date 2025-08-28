import { CreateCategoryInputDTO } from "../../../DTO's/CategoryDTO";

export interface ICreateServiceCategoryUseCase{
    execute(input : CreateCategoryInputDTO ):Promise<void>
} 