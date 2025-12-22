import { NewEmailRequestInputDTO } from "../../../dto/EditProfileDTO";

export interface IRequestEmailUpdateUseCase {
  execute(input:NewEmailRequestInputDTO): Promise<void> ;
}