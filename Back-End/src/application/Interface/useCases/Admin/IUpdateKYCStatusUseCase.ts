import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../../DTOs/UpdateKYCStatusDTO";

export interface IUpdateKYCStatusUseCase {
  execute(input: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>;
}
