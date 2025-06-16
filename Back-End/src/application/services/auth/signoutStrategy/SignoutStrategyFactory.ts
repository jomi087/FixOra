import { RoleEnum } from "../../../../domain/constant/Roles.js";
import { ISignoutStrategy } from "./interface/ISignoutStrategy.js";

export class SignoutStrategyFactory {
    private strategies = new Map<RoleEnum, ISignoutStrategy>();

    register(role: RoleEnum, strategy: ISignoutStrategy) {  
        this.strategies.set(role,strategy)
    }
    
    getStrategy(role: RoleEnum): ISignoutStrategy {
        const strategy = this.strategies.get(role);
        if (!strategy) throw { status: 400 , message: "Invalid role" };
        return strategy;
    }
    
}