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
import { createUserAuthMiddleware } from "../interfaces/middleware/UserAuthMiddleware.js";
const userAuthMiddleware = createUserAuthMiddleware(tokenService, userRepository)

/******************************************************************************************************************************************************/
import { SignupUseCase } from "../application/useCases/SignupUseCase.js";
const signupUseCase = new SignupUseCase(userRepository, otpRepository, emailService, otpGenratorservice, hashService ) 

/******************************************************************************************************************************************************/
import { VerifySignupOtpUseCase } from "../application/useCases/VerifySignupOtpUseCase.js";
const verifySignupOtpUseCase = new VerifySignupOtpUseCase(otpRepository, userRepository)

/******************************************************************************************************************************************************/
import { ResendOtpUseCase } from "../application/useCases/ResendOtpUseCase.js";
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, otpGenratorservice, emailService)

/******************************************************************************************************************************************************/
//sign-in Strategy
import { configureAuthStrategies } from "../infrastructure/config/authSigninConfig.js";
const authFactory = configureAuthStrategies(userRepository, hashService)

import { SigninUseCase } from "../application/useCases/SigninUseCase.js";
const signinUseCase = new SigninUseCase(authFactory, tokenService, userRepository)

/***************************************************************************************************************************************************/
import { ForgotPasswordUseCase } from "../application/useCases/ForgotPasswordUseCase.js";
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository,emailService )

/******************************************************************************************************************************************************/
import { ResetPasswordUseCase } from "../application/useCases/ResetPasswordUseCase.js";
const resetPasswordUseCase = new ResetPasswordUseCase(hashService,userRepository)

/******************************************************************************************************************************************************/
import { RefreshTokenUseCase } from "../application/useCases/RefreshTokenUseCase.js";
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService,userRepository)

/******************************************************************************************************************************************************/
//sign-out Strategy
import { configureSignoutStrategies } from "../infrastructure/config/authSignoutConfig.js";
const  SignoutFactory = configureSignoutStrategies(userRepository)
import { SignoutUseCase } from "../application/useCases/SignoutUseCase.js";
const signoutUseCase = new SignoutUseCase(SignoutFactory)

/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/
import { UpdateProfileUseCase } from "../application/useCases/client/UpdateProfileUseCase.js";
const updateProfileUseCase = new UpdateProfileUseCase(userRepository)

/******************************************************************************************************************************************************/
import { VerifyPasswordUseCase } from "../application/useCases/client/VerifyPasswordUseCase.js";
const verifyPasswordUseCase = new VerifyPasswordUseCase(userRepository,hashService,emailService)
/******************************************************************************************************************************************************/
/******************************************************************************************************************************************************/

import { AuthController } from "../interfaces/controllers/AuthController.js";
import { UserController } from "../interfaces/controllers/UserContoller.js";
const authController = new AuthController(signupUseCase, verifySignupOtpUseCase, resendOtpUseCase, signinUseCase, forgotPasswordUseCase, resetPasswordUseCase, refreshTokenUseCase, signoutUseCase) 
const userController = new UserController(updateProfileUseCase,verifyPasswordUseCase,resetPasswordUseCase)

export {
    authController,
    userAuthMiddleware,
    userController
}