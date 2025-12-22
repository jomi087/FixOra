import { EditProfileInputDTO, UpdatedProfileOutputDTO } from "../../../dtos/EditProfileDTO";

export interface IUpdateProfileUseCase {
    execute(input: EditProfileInputDTO ): Promise<UpdatedProfileOutputDTO>;
}