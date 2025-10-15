import { SignOutDTO } from "../../../DTOs/AuthDTO/SingOutDTO";

export interface ISignOutStrategy {
  execute(input: SignOutDTO ): Promise<void>;
}