import { EditProfileInputDTO, UpdatedProfileOutputDTO } from "../../../DTO's/EditProfileDTO.js";

export interface IUpdateProfileUseCase {
    execute(input: EditProfileInputDTO ): Promise<UpdatedProfileOutputDTO>;
}