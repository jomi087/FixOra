import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../../dtos/GetCustomerDTO";

export interface IGetCustomersUseCase {
  execute(input: GetCustomersInputDTO): Promise<GetCustomersOutputDTO>;
}
