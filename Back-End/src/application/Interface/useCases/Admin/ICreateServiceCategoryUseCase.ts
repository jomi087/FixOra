import { CategoryInputDTO } from "../../../DTO's/CategoryInputDTO.js";

export interface ICreateServiceCategoryUseCase{
    execute(input : CategoryInputDTO):Promise<void>
}