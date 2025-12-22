import { ActiveCategoryOutputDTO } from "../../../dto/CategoryDTO";

export interface IActiveServiceUseCase{
    execute(): Promise<ActiveCategoryOutputDTO[]>
}