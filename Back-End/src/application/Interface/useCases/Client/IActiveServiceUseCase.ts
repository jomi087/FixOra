import { ActiveCategoryOutputDTO } from "../../../DTO's/CategoryDTO";

export interface IActiveServiceUseCase{
    execute(): Promise<ActiveCategoryOutputDTO[]>
}