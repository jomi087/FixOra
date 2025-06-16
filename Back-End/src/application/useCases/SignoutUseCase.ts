import { RoleEnum } from "../../domain/constant/Roles.js";
import { SignoutStrategyFactory } from "../services/auth/signoutStrategy/SignoutStrategyFactory.js";

export class SignoutUseCase {
    constructor(
        private readonly SignoutFactory : SignoutStrategyFactory,
    ) { }

    async execute(userId: string , role : RoleEnum) {
        try {
            const strategy = this.SignoutFactory.getStrategy(role)
            await strategy.signout(userId)
            
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'signout failed, (something went wrong)'};
        }
    }
}