import { UpdateKYCStatusInputDTO, UpdateKYCStatusOutputDTO } from "../../../dto/UpdateKYCStatusDTO";

export interface IUpdateKYCStatusUseCase {
  execute(input: UpdateKYCStatusInputDTO): Promise<UpdateKYCStatusOutputDTO>;
}
