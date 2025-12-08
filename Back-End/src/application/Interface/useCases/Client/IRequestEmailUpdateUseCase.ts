import { NewEmailRequestInputDTO } from "../../../DTOs/EditProfileDTO";

export interface IRequestEmailUpdateUseCase {
  execute(input:NewEmailRequestInputDTO): Promise<void> ;
}