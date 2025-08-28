import { RoleEnum } from "../../shared/Enums/Roles";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository";
import { IHashService } from "../../domain/interface/ServiceInterface/IHashService";
import { AuthStrategyFactory } from "../../application/strategies/auth/AuthStrategyFactory";
import { CustomerAuthStrategy } from "../../application/strategies/auth/CustomerAuthStrategy";
import { AdminAuthStrategy } from "../../application/strategies/auth/AdminAuthStrategy";
import { ProviderAuthStrategy } from "../../application/strategies/auth/ProviderAuthStrategy";


export function configureAuthStrategies( userRepository: IUserRepository, hashService: IHashService): AuthStrategyFactory {  
    
    const authFactory = new AuthStrategyFactory();

    // Register customer authentication strategy
    const customerStrategy = new CustomerAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Customer, customerStrategy); 

    // Register Provider authentication strategy
    const providerStrategy = new ProviderAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Provider, providerStrategy); 

    // Register admin authentication strategy
    const adminStrategy = new AdminAuthStrategy(userRepository, hashService)
    authFactory.register(RoleEnum.Admin, adminStrategy); 

    return authFactory;
} 


