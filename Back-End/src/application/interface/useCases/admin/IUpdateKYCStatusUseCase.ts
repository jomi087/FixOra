import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../../dtos/UpdateKYCStatusDTO";

export interface IUpdateKYCStatusUseCase {
  execute(input: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>;
}
