import { Category } from "../../entities/CategoryEntity";
import { Provider } from "../../entities/ProviderEntity";
import { User } from "../../entities/UserEntity";

export interface IProviderRepository {
    create(data: Provider): Promise<void>
    findByUserId(userId: string): Promise<Provider | null>
    // findProvidersWithFilters(option: { searchQuery: string; filter: string }, currentPage: number, limit: number): Promise<{
    //     data: ProviderWithDetails[]; total: number
    // }>
    findProvidersWithFilters(option: { searchQuery: string; filter: string }, currentPage: number, limit: number): Promise<{
        data: {
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "mobileNo" | "location">
            provider: Pick<Provider, "providerId" | "dob" | "gender" | "profileImage" | "serviceCharge" | "kyc" | "isOnline">
            service: Pick<Category, "categoryId" | "name" | "subcategories">
        }[]
        total: number
    }>
}