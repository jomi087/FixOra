import { Provider, ProviderWithDetails } from "../../entities/ProviderEntity.js";

export interface IProviderRepository {
    create(data: Provider): Promise<void> 
    findByUserId(userId: string): Promise<Provider | null>

    findProvidersWithFilters( option: { searchQuery: string; filter: string }, currentPage: number, limit: number ): Promise<{ data: ProviderWithDetails []; total: number }> 
    

    

    
}