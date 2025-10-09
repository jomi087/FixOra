import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../DTO's/GetCustomerDTO";
import { IGetCustomersUseCase } from "../../Interface/useCases/Admin/IGetCustomersUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetCustomersUseCase implements IGetCustomersUseCase {
    constructor(
        private readonly _userRepository : IUserRepository,
    ) {}
    
    async execute(input : GetCustomersInputDTO ):Promise<GetCustomersOutputDTO>{    
        try {            
            const { searchQuery, filter, currentPage, limit } = input;

            const users = await this._userRepository.findUsersWithFilters(
                { searchQuery, filter },
                currentPage, limit,
            );
            
            return {
                data: users.data,
                total : users.total
            };
            
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}


