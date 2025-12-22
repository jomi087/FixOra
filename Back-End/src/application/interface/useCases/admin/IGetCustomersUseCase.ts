import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../../dto/GetCustomerDTO";

export interface IGetCustomersUseCase {
  execute(input: GetCustomersInputDTO): Promise<GetCustomersOutputDTO>;
}
