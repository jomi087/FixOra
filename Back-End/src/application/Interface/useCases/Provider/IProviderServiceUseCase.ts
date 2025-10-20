import { ShortCategoryOutputDTO } from "../../../DTOs/CategoryDTO";

export interface IProviderServiceUseCase {
    execute(providerUserId:string): Promise<ShortCategoryOutputDTO>
}