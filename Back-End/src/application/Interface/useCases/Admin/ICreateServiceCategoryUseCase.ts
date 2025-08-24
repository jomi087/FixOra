import { CreateCategoryInputDTO } from "../../../DTO's/CategoryDTO.js";

export interface ICreateServiceCategoryUseCase{
    execute(input : CreateCategoryInputDTO ):Promise<void>
} 