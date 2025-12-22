import { ShortCategoryOutputDTO } from "../../../dto/CategoryDTO";

export interface IProviderServiceUseCase {
    execute(providerUserId:string): Promise<ShortCategoryOutputDTO>
}