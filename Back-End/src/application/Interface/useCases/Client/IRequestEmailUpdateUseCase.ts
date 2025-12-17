import { NewEmailRequestInputDTO } from "../../../dtos/EditProfileDTO";

export interface IRequestEmailUpdateUseCase {
  execute(input:NewEmailRequestInputDTO): Promise<void> ;
}