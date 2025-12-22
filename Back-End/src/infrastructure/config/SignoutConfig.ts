import { RoleEnum } from "../../shared/enums/Roles";
import { IUserRepository } from "../../domain/interface/repositoryInterfaceTempName/IUserRepository";
import { SignOutStrategyFactory } from "../../application/strategies/auth/signOut/SignOutStrategyFactory";
import { CustomerSignOutStrategy } from "../../application/strategies/auth/signOut/CustomerSignOutStrategy";
import { ProviderSignOutStrategy } from "../../application/strategies/auth/signOut/ProviderSignOutStrategy";
import { AdminSignOutStrategy } from "../../application/strategies/auth/signOut/AdminSignOutStrategy";


export function configureSignOutStrategies( userRepository: IUserRepository): SignOutStrategyFactory {  
    
    const signOutFactory = new SignOutStrategyFactory();

    // Register customer strategy
    const customerStrategy = new CustomerSignOutStrategy(userRepository);
    signOutFactory.register(RoleEnum.Customer, customerStrategy); 

    // Register Provider  strategy
    const providerStrategy = new ProviderSignOutStrategy(userRepository);
    signOutFactory.register(RoleEnum.Provider, providerStrategy); 

    // Register admin  strategy
    const adminStrategy = new AdminSignOutStrategy(userRepository);
    signOutFactory.register(RoleEnum.Admin, adminStrategy); 

    return signOutFactory;
} 

