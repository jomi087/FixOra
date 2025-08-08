import { Category } from "../../entities/CategoryEntity.js";
import { Provider, ProviderWithDetails } from "../../entities/ProviderEntity.js";
import { User } from "../../entities/UserEntity.js";

export interface IProviderRepository {
    create(data: Provider): Promise<void> 
    findByUserId(userId: string): Promise<Provider | null>

    findProvidersWithFilters( option: { searchQuery: string; filter: string }, currentPage: number, limit: number ): Promise<{ data: ProviderWithDetails []; total: number }> 
    
    //move this to user Repo and impliment distance logic
    findProviderBookingsById(providerId: string): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">,
        provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories" >
    }>
    

    
}