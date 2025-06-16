import { AuthStrategyFactory } from "../../application/services/auth/signinStrategy/AuthStrategyFactory.js";
import { CustomerAuthStrategy } from "../../application/services/auth/signinStrategy/CustomerAuthStrategy.js";
import { RoleEnum } from "../../domain/constant/Roles.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../domain/interface/ServiceInterface/IHashService.js";


export function configureAuthStrategies( userRepository: IUserRepository, hashService: IHashService): AuthStrategyFactory {  
    
    const authFactory = new AuthStrategyFactory();

    // Register customer authentication strategy
    const customerStrategy = new CustomerAuthStrategy(userRepository, hashService);
    authFactory.register(RoleEnum.Customer, customerStrategy); 

    // Register provider authentication strategy
    // const providerStrategy = new ProviderAuthStrategy(userRepository, hashService)
    // authFactory.register(RoleEnum.Provider, providerStrategy); 

    // Register admin authentication strategy
    // const adminStrategy = new AdminAuthStrategy(userRepository, hashService)
    // authFactory.register(RoleEnum.Admin, adminStrategy); 

    return authFactory;
} 


