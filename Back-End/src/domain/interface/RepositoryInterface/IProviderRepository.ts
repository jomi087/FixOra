import { Category } from "../../entities/CategoryEntity.js";
import { Provider, ProviderWithDetails } from "../../entities/ProviderEntity.js";
import { User } from "../../entities/UserEntity.js";

export interface IProviderRepository {
    create(data: Provider): Promise<void> 
    findByUserId(userId: string): Promise<Provider | null>
    findProvidersWithFilters( option: { searchQuery: string; filter: string }, currentPage: number, limit: number ): Promise<{ data: ProviderWithDetails []; total: number }> 
    // findActiveProvidersWithFilters(
    //     option: {
    //         searchQuery: string;
    //         filter: string
    //         extraFilter?: {
    //             selectedService?: string;
    //             nearByFilter?: string;
    //             ratingFilter?: number;
    //             availabilityFilter?: string;
    //         },
    //         coordinates: {
    //             latitude: number;
    //             longitude: number;
    //         }
    //     },
    //     currentPage: number, limit: number
    // ): Promise<{
    //     data: {
    //         provider: Partial<Provider>,
    //         user: Partial<User>,
    //         category: Partial<Category>,
    //         averageRating: number,
    //         totalRatings: number
    //     }[];
    //     total: number
    // }>
    findActiveProvidersWithFilters(
        option: {
            searchQuery: string;
            filter: string
            extraFilter?: {
                selectedService?: string;
                nearByFilter?: string;
                ratingFilter?: number;
                availabilityFilter?: string;
            },
            coordinates: {
                latitude: number;
                longitude: number;
            }
        },
        currentPage: number, limit: number
    ): Promise<{
        data: {
            user: Partial<User>,
            provider: Partial<Provider>,
            category: Partial<Category>,
            averageRating: number,
            totalRatings: number
        }[];
        total: number
    }>
}