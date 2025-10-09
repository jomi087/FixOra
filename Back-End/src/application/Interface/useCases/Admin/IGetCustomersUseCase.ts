import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../../DTOs/GetCustomerDTO";

export interface IGetCustomersUseCase {
  execute(input: GetCustomersInputDTO): Promise<GetCustomersOutputDTO>;
}
