import { EditProfileInputDTO, UpdatedProfileOutputDTO } from "../../../DTOs/EditProfileDTO";

export interface IUpdateProfileUseCase {
    execute(input: EditProfileInputDTO ): Promise<UpdatedProfileOutputDTO>;
}