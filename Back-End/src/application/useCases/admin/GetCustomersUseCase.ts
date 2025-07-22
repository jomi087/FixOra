import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../DTO's/GetCustomerDTO.js";
import { IGetCustomersUseCase } from "../../Interface/useCases/Admin/IGetCustomersUseCase.js";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR} = Messages

export class GetCustomersUseCase implements IGetCustomersUseCase {
    constructor(
        private readonly userRepository : IUserRepository,
    ) {}
    
    async execute(input :GetCustomersInputDTO ):Promise<GetCustomersOutputDTO>{    
        try {            
            const { searchQuery, filter, currentPage, limit } = input;

            const users = await this.userRepository.findUsersWithFilters(
                { searchQuery, filter },
                currentPage, limit,
                ['password', 'refreshToken', 'googleId', 'updatedAt']
            )

            // remove omit and useMapper dto customerListalredy created

            return {
                data: users.data,
                total : users.total
            };
            
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}


