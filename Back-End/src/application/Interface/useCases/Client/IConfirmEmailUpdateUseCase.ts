import { EmailUpdateVerfifyOTPInputDTO } from "../../../dtos/EditProfileDTO";

export interface IConfirmEmailUpdateUseCase {
    execute(input: EmailUpdateVerfifyOTPInputDTO): Promise<void>;
}