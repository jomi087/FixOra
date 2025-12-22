import { ShortCategoryOutputDTO } from "../../../dtos/CategoryDTO";

export interface IProviderServiceUseCase {
    execute(providerUserId:string): Promise<ShortCategoryOutputDTO>
}