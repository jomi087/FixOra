import { SignOutDTO } from "../../../dto/auth/SingOutDTO";

export interface ISignOutStrategy {
  execute(input: SignOutDTO ): Promise<void>;
}