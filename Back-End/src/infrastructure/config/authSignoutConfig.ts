import { CustomerSignoutStrategy } from "../../application/services/auth/signoutStrategy/CustomerSignoutStrategy.js";
import { SignoutStrategyFactory } from "../../application/services/auth/signoutStrategy/SignoutStrategyFactory.js";
import { RoleEnum } from "../../domain/constant/Roles.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";


export function configureSignoutStrategies( userRepository: IUserRepository): SignoutStrategyFactory {  
    
    const SignoutFactory = new SignoutStrategyFactory();

    const customerSignoutStrategy = new CustomerSignoutStrategy(userRepository);
    
    SignoutFactory.register(RoleEnum.Customer, customerSignoutStrategy); 
    
    return SignoutFactory;
    
} 

