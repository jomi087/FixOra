import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../../DTO's/UpdateKYCStatusDTO.js";

export interface IUpdateKYCStatusUseCase {
  execute(input: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>;
}
