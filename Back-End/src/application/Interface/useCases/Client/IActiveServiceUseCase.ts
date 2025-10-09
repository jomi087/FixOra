import { ActiveCategoryOutputDTO } from "../../../DTOs/CategoryDTO";

export interface IActiveServiceUseCase{
    execute(): Promise<ActiveCategoryOutputDTO[]>
}