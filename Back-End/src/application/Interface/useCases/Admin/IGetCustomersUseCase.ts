import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../../DTO's/GetCustomerDTO";

export interface IGetCustomersUseCase {
  execute(input: GetCustomersInputDTO): Promise<GetCustomersOutputDTO>;
}
