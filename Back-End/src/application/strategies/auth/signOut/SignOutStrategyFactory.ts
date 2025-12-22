import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { RoleEnum } from "../../../../shared/enums/Roles";
import { ISignOutStrategy } from "../../../interfacetemp/strategies/auth/ISignOutStrategy";
import { AppError } from "../../../../shared/errors/AppError";


const { INVALID_ROLE } = Messages;
const { BAD_REQUEST } = HttpStatusCode;

export class SignOutStrategyFactory  {
    private strategies = new Map<RoleEnum, ISignOutStrategy>();

    register(role: RoleEnum, strategy: ISignOutStrategy) {  
        this.strategies.set(role,strategy);
    }
    
    getStrategy(role: RoleEnum): ISignOutStrategy {
        const strategy = this.strategies.get(role);
        if (!strategy) throw new AppError( BAD_REQUEST, INVALID_ROLE ) ;
        return strategy;
    }
}

