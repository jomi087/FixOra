import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { RoleEnum } from "../../../../shared/enums/Roles";
import { ISignOutStrategy } from "../../../Interface/strategies/auth/ISignOutStrategy";


const { INVALID_ROLE } = Messages;
const { BAD_REQUEST } = HttpStatusCode;

export class SignOutStrategyFactory  {
    private strategies = new Map<RoleEnum, ISignOutStrategy>();

    register(role: RoleEnum, strategy: ISignOutStrategy) {  
        this.strategies.set(role,strategy);
    }
    
    getStrategy(role: RoleEnum): ISignOutStrategy {
        const strategy = this.strategies.get(role);
        if (!strategy) throw { status: BAD_REQUEST , message: INVALID_ROLE };
        return strategy;
    }
}

