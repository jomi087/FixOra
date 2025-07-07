import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";


interface filters {
  searchQuery: string;
  filter: string;
  currentPage: number;
  limit : number;
}


export class GetCustomersUseCase {
    constructor(
        private readonly userRepository : IUserRepository,
    ) {}
    
    async execute(input : filters ) {    
        try {            
            const { searchQuery, filter, currentPage, limit } = input;

            const users = await this.userRepository.findUsersWithFilters(
                { searchQuery, filter },
                currentPage, limit,
                ['password', 'refreshToken', 'googleId', 'updatedAt']
            )

            return {
                customersData: users.data,
                total : users.total
            };
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'Fetching Customer data failed, (something went wrong)'};
        }
    }
}


