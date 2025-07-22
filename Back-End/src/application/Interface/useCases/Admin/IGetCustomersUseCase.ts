import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../../DTO's/GetCustomerDTO.js";

export interface IGetCustomersUseCase {
  execute(input: GetCustomersInputDTO): Promise<GetCustomersOutputDTO>;
}
