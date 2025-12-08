import { EmailUpdateVerfifyOTPInputDTO } from "../../../DTOs/EditProfileDTO";

export interface IConfirmEmailUpdateUseCase {
    execute(input: EmailUpdateVerfifyOTPInputDTO): Promise<void>;
}