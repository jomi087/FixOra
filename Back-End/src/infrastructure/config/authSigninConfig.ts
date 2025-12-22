import { RoleEnum } from "../../shared/enumss/Roles";
import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IHashService } from "../../domain/interface/serviceInterface/IHashService";
import { AuthStrategyFactory } from "../../application/strategies/auth/signIn/AuthStrategyFactory";
import { CustomerAuthStrategy } from "../../application/strategies/auth/signIn/CustomerAuthStrategy";
import { AdminAuthStrategy } from "../../application/strategies/auth/signIn/AdminAuthStrategy";
import { ProviderAuthStrategy } from "../../application/strategies/auth/signIn/ProviderAuthStrategy";


export function configureAuthStrategies(
    userRepository: IUserRepository,
    hashService: IHashService): AuthStrategyFactory {  
    
    const authFactory = new AuthStrategyFactory();

    // Register customer authentication strategy
    const customerStrategy = new CustomerAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Customer, customerStrategy); 

    // Register Provider authentication strategy
    const providerStrategy = new ProviderAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Provider, providerStrategy); 

    // Register admin authentication strategy
    const adminStrategy = new AdminAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Admin, adminStrategy); 

    return authFactory;
} 


