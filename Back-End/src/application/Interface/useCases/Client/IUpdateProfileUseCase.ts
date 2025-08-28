import { EditProfileInputDTO, UpdatedProfileOutputDTO } from "../../../DTO's/EditProfileDTO";

export interface IUpdateProfileUseCase {
    execute(input: EditProfileInputDTO ): Promise<UpdatedProfileOutputDTO>;
}