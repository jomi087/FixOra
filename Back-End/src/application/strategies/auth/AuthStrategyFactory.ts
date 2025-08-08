import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { RoleEnum } from "../../../shared/Enums/Roles.js";
import { IAuthStrategy } from "../../Interface/strategies/auth/IAuthStrategy.js";


const { INVALID_ROLE } = Messages
const {BAD_REQUEST } = HttpStatusCode

export class AuthStrategyFactory {
    private strategies = new Map<RoleEnum, IAuthStrategy>();

    register(role: RoleEnum, strategy: IAuthStrategy) {  
        this.strategies.set(role,strategy)
    }
    
    getStrategy(role: RoleEnum): IAuthStrategy {
        const strategy = this.strategies.get(role);
        if (!strategy) throw { status: BAD_REQUEST , message: INVALID_ROLE };
        return strategy;
    }
}

