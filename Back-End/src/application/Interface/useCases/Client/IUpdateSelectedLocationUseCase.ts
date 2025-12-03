import { SelectedLocationInputDTO } from "../../../DTOs/EditProfileDTO";

export interface IUpdateSelectedLocationUseCase {
    execute(input: SelectedLocationInputDTO ):Promise<void>
}