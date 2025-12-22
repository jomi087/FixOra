import { CreateCategoryInputDTO } from "../../../dto/CategoryDTO";

export interface ICreateServiceCategoryUseCase{
    execute(input : CreateCategoryInputDTO ):Promise<void>
} 