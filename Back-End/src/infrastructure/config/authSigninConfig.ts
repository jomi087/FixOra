import { RoleEnum } from "../../shared/constant/Roles.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../domain/interface/ServiceInterface/IHashService.js";
import { AuthStrategyFactory } from "../../application/strategies/auth/AuthStrategyFactory.js";
import { CustomerAuthStrategy } from "../../application/strategies/auth/CustomerAuthStrategy.js";
import { AdminAuthStrategy } from "../../application/strategies/auth/AdminAuthStrategy.js";


export function configureAuthStrategies( userRepository: IUserRepository, hashService: IHashService): AuthStrategyFactory {  
    
    const authFactory = new AuthStrategyFactory();

    // Register customer authentication strategy
    const customerStrategy = new CustomerAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Customer, customerStrategy); 

    // Register Provider authentication strategy
    const providerStrategy = new CustomerAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Provider, providerStrategy); 

    // Register admin authentication strategy
    const adminStrategy = new AdminAuthStrategy(userRepository, hashService)
    authFactory.register(RoleEnum.Admin, adminStrategy); 

    return authFactory;
} 


