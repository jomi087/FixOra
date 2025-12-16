import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../DTOs/GetCustomerDTO";
import { IGetCustomersUseCase } from "../../Interface/useCases/Admin/IGetCustomersUseCase";


export class GetCustomersUseCase implements IGetCustomersUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: GetCustomersInputDTO): Promise<GetCustomersOutputDTO> {
        try {
            const { searchQuery, filter, currentPage, limit } = input;

            const users = await this._userRepository.findUsersWithFilters(
                { searchQuery, filter },
                currentPage, limit,
            );

            return {
                data: users.data,
                total: users.total
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}


