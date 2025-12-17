import { ActiveCategoryOutputDTO } from "../../../dtos/CategoryDTO";

export interface IActiveServiceUseCase{
    execute(): Promise<ActiveCategoryOutputDTO[]>
}