import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import { OtpRepository } from "../infrastructure/database/repositories/OtpRepository.js";
import { EmailService } from "../infrastructure/services/EmailService.js";
import { OtpGenratorservice } from "../infrastructure/services/OtpGeneratorService.js";
import { HashService } from "../infrastructure/services/HashService.js";
import { TokenService } from "../infrastructure/services/TokenService.js";

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const emailService = new EmailService(); 
const otpGenratorservice = new OtpGenratorservice();
const hashService = new HashService();
const tokenService = new TokenService()

/******************************************************************************************************************************************************/
//userAuth- Middleware
import { createUserAuthMiddleware } from "../interfaces/middleware/userAuthMiddleware.js";
const userAuthMiddleware = createUserAuthMiddleware(tokenService, userRepository)

/******************************************************************************************************************************************************/
import { SignupUseCase } from "../application/useCases/SignupUseCase.js";
const signupUseCase = new SignupUseCase(userRepository, otpRepository, emailService, otpGenratorservice, hashService ) 

/******************************************************************************************************************************************************/
import { VerifyAcUseCase } from "../application/useCases/VerifyAcUseCase.js";
const verifyAcUseCase = new VerifyAcUseCase(otpRepository, userRepository)

/******************************************************************************************************************************************************/
import { ResendOtpUseCase } from "../application/useCases/ResendOtpUseCase.js";
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, otpGenratorservice, emailService)

/******************************************************************************************************************************************************/
//sign-in Strategy
import { configureAuthStrategies } from "../infrastructure/config/authSigninConfig.js";
const authFactory = configureAuthStrategies(userRepository, hashService)
//console.log("authFactory",authFactory)

import { SigninUseCase } from "../application/useCases/SigninUseCase.js";
const signinUseCase = new SigninUseCase(authFactory, tokenService, userRepository)

/******************************************************************************************************************************************************/
import { RefreshTokenUseCase } from "../application/useCases/RefreshTokenUseCase.js";
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService,userRepository)

/******************************************************************************************************************************************************/
import { configureSignoutStrategies } from "../infrastructure/config/authSignoutConfig.js";
const  SignoutFactory = configureSignoutStrategies(userRepository)
import { SignoutUseCase } from "../application/useCases/SignoutUseCase.js";
const signoutUseCase = new SignoutUseCase(SignoutFactory)

/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/
import { AuthController } from "../interfaces/controllers/AuthController.js";
const authController = new AuthController(signupUseCase, verifyAcUseCase,resendOtpUseCase,signinUseCase,refreshTokenUseCase,signoutUseCase) 

export { authController , userAuthMiddleware }