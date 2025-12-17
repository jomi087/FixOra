import { SelectedLocationInputDTO } from "../../../dtos/EditProfileDTO";

export interface IUpdateSelectedLocationUseCase {
    execute(input: SelectedLocationInputDTO ):Promise<void>
}