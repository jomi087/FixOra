import { EmailUpdateVerfifyOTPInputDTO } from "../../../dto/EditProfileDTO";

export interface IConfirmEmailUpdateUseCase {
    execute(input: EmailUpdateVerfifyOTPInputDTO): Promise<void>;
}