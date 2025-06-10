import { RoleEnum } from "../../../../domain/constant/Roles.js";
import { IAuthStrategy } from "./interface/IAuthStrategy.js";

export class AuthStrategyFactory {
    private strategies = new Map<RoleEnum, IAuthStrategy>();

    register(role: RoleEnum, strategy: IAuthStrategy) {  
        this.strategies.set(role,strategy)
    }
    
    getStrategy(role: RoleEnum): IAuthStrategy {
        const strategy = this.strategies.get(role);
        if (!strategy) throw { status: 400 , message: "Invalid role" };
        return strategy;
    }

    
}

