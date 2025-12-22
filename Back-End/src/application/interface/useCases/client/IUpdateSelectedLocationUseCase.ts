import { SelectedLocationInputDTO } from "../../../dto/EditProfileDTO";

export interface IUpdateSelectedLocationUseCase {
    execute(input: SelectedLocationInputDTO ):Promise<void>
}