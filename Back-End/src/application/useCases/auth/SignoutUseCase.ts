import { ISignoutUseCase } from "../../interface/useCases/auth/ISignoutUseCase";
import { SignOutInputDTO } from "../../dto/auth/SingOutDTO";
import { SignOutStrategyFactory } from "../../strategies/auth/signOut/SignOutStrategyFactory";


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

        } catch (error: unknown) {
            throw error;
        }
    }
}