import { ActiveCategoryOutputDTO } from "../../../DTO's/CategoryDTO.js";

export interface IActiveServiceUseCase{
    execute(): Promise<ActiveCategoryOutputDTO[]>
}