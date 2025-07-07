import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { KYCStatus } from "../../../shared/constant/KYCstatus.js";

interface filters {
    searchQuery: string;
    filter: string;
    currentPage: number;
    limit: number;
    ProviderStatus:KYCStatus
}


export class GetProvidersUseCase{
    constructor(
        private readonly userRepository : IUserRepository,
    ) {}
    
    async execute(input: filters) {
        
        try {
            const { searchQuery, filter, currentPage, limit, ProviderStatus } = input

            const users = await this.userRepository.findProvidersWithFilters(
                { searchQuery, filter, ProviderStatus },
                currentPage, limit,
                ['password', 'refreshToken', 'googleId', 'userId', 'updatedAt']
            )

            return {
                providerData: users.data,
                total: users.total
            };
            
        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: 500, message: 'Fetching Provider data failed, (something went wrong)' };
        }
    }

}