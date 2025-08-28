import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../../DTO's/UpdateKYCStatusDTO";

export interface IUpdateKYCStatusUseCase {
  execute(input: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>;
}
