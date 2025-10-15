import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { ISignoutUseCase } from "../../Interface/useCases/Auth/ISignoutUseCase";
import { SignOutInputDTO } from "../../DTOs/AuthDTO/SingOutDTO";
import { SignOutStrategyFactory } from "../../strategies/auth/signOut/SignOutStrategyFactory";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class SignoutUseCase implements ISignoutUseCase {
    constructor(
        private readonly _signOutFactory: SignOutStrategyFactory,
    ) { }

    async execute(input: SignOutInputDTO): Promise<void> {
        try {
            const strategy = this._signOutFactory.getStrategy(input.role);
            await strategy.execute({
                userId: input.userId,
                fcmToken: input.fcmToken
            });

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}