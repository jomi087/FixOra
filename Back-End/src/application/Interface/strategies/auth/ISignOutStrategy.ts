import { SignOutDTO } from "../../../dtos/AuthDTO/SingOutDTO";

export interface ISignOutStrategy {
  execute(input: SignOutDTO ): Promise<void>;
}