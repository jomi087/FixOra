import { EditProfileInputDTO, UpdatedProfileOutputDTO } from "../../../dto/EditProfileDTO";

export interface IUpdateProfileUseCase {
    execute(input: EditProfileInputDTO ): Promise<UpdatedProfileOutputDTO>;
}