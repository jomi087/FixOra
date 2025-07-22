import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { KYCStatus } from "../../../shared/constant/KYCstatus.js";
import { Messages } from "../../../shared/constant/Messages.js";

interface filters {
    searchQuery: string;
    filter: string;
    currentPage: number;
    limit: number;
}

const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR} = Messages

export class GetProvidersUseCase{
    constructor(
        private readonly userRepository : IUserRepository,
    ) {}
    
    async execute(input: filters) {
        
        try {
            const { searchQuery, filter, currentPage, limit } = input

            const users = await this.userRepository.findProvidersWithFilters(
                { searchQuery, filter },
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
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}