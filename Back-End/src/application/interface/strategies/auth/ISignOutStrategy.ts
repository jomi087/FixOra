import { SignOutDTO } from "../../../dtos/auth/SingOutDTO";

export interface ISignOutStrategy {
  execute(input: SignOutDTO ): Promise<void>;
}