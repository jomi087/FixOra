import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../dtos/GetCustomerDTO";
import { IGetCustomersUseCase } from "../../interfacetemp/useCases/admin/IGetCustomersUseCase";


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


