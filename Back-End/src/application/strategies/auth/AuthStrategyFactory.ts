import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { RoleEnum } from "../../../shared/enums/Roles";
import { IAuthStrategy } from "../../Interface/strategies/auth/IAuthStrategy";


const { INVALID_ROLE } = Messages;
const { BAD_REQUEST } = HttpStatusCode;

export class AuthStrategyFactory {
    private strategies = new Map<RoleEnum, IAuthStrategy>();

    register(role: RoleEnum, strategy: IAuthStrategy) {  
        this.strategies.set(role,strategy);
    }
    
    getStrategy(role: RoleEnum): IAuthStrategy {
        const strategy = this.strategies.get(role);
        if (!strategy) throw { status: BAD_REQUEST , message: INVALID_ROLE };
        return strategy;
    }
}

