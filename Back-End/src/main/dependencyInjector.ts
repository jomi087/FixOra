import { UserRepository } from "../infrastructure/database/repositories/UserRepository.js";
import { OtpRepository } from "../infrastructure/database/repositories/OtpRepository.js";
import { CategoryRepository } from "../infrastructure/database/repositories/CategoryRepository.js";
import { KYCRequestRepository } from "../infrastructure/database/repositories/KYCRequestRepository.js";
import { ProviderRepository } from "../infrastructure/database/repositories/ProviderRepository.js";

import { WinstonLogger } from "../infrastructure/services/WinstonLoggerService.js";
import { EmailService } from "../infrastructure/services/EmailService.js";
import { OtpGenratorservice } from "../infrastructure/services/OtpGeneratorService.js";
import { HashService } from "../infrastructure/services/HashService.js";
import { TokenService } from "../infrastructure/services/TokenService.js";
import { GoogleOAuthService } from "../infrastructure/services/GoogleOAuthService.js";
import { ImageUploaderService } from "../infrastructure/services/ImageUploaderService.js";


const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const categoryRepository = new CategoryRepository()
const kycRequestRepository = new KYCRequestRepository()
const providerRepository = new ProviderRepository()
const bookingRepository = new BookingRepository()

const loggerService = new WinstonLogger()
const emailService = new EmailService(); 
const otpGenratorservice = new OtpGenratorservice();
const hashService = new HashService();
const tokenService = new TokenService()
const googleOAuthService = new GoogleOAuthService()
const imageUploaderService = new ImageUploaderService()
const notificationService = new NotificationService()

/******************************************************************************************************************************************************/
import { createAuthMiddleware } from "../interfaces/middleware/authMiddleware.js";
const AuthMiddleware = createAuthMiddleware(tokenService, userRepository)

import { createErrorHandler } from "../interfaces/middleware/errorHandler.js";
export const errorHandler = createErrorHandler(loggerService);

/******************************************************************************************************************************************************/
import { SignupUseCase } from "../application/useCases/auth/SignupUseCase.js";
const signupUseCase = new SignupUseCase(userRepository, otpRepository, emailService, otpGenratorservice, hashService ) 

import { VerifySignupOtpUseCase } from "../application/useCases/auth/VerifySignupOtpUseCase.js";
const verifySignupOtpUseCase = new VerifySignupOtpUseCase(otpRepository, userRepository)

import { ResendOtpUseCase } from "../application/useCases/auth/ResendOtpUseCase.js";
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, otpGenratorservice, emailService)

import { configureAuthStrategies } from "../infrastructure/config/authSigninConfig.js";
const authFactory = configureAuthStrategies(userRepository, hashService)
import { SigninUseCase } from "../application/useCases/auth/SigninUseCase.js";
const signinUseCase = new SigninUseCase(authFactory, tokenService, userRepository)

import { GoogleSigninUseCase } from "../application/useCases/auth/GoogleSigninUseCase.js";
const googleSigninUseCase = new GoogleSigninUseCase(googleOAuthService,userRepository,tokenService)

import { ForgotPasswordUseCase } from "../application/useCases/auth/ForgotPasswordUseCase.js";
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository,emailService )

import { ResetPasswordUseCase } from "../application/useCases/auth/ResetPasswordUseCase.js";
const resetPasswordUseCase = new ResetPasswordUseCase(hashService,userRepository)

import { RefreshTokenUseCase } from "../application/useCases/auth/RefreshTokenUseCase.js";
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userRepository)

import { GetLandingDataUseCase } from "../application/useCases/public/GetLandingDataUseCase.js";
const getLandingDataUseCase = new GetLandingDataUseCase(categoryRepository)

import { SignoutUseCase } from "../application/useCases/auth/SignoutUseCase.js";
const signoutUseCase = new SignoutUseCase(userRepository)

/******************************************************************************************************************************************************
                                                        Customer Specific
******************************************************************************************************************************************************/
import { ActiveServiceUseCase } from "../application/useCases/client/ActiveServiceUseCase.js";
const activeServiceUseCase = new ActiveServiceUseCase(categoryRepository)

import { GetActiveProvidersUseCase } from "../application/useCases/client/GetActiveProvidersUseCase.js";
const getActiveProvidersUseCase = new GetActiveProvidersUseCase(userRepository)

import { KYCRequestUseCase } from "../application/useCases/client/kYCRequestUseCase.js";
const kycRequestUseCase = new KYCRequestUseCase(kycRequestRepository)

import { ProviderBookingsInfoUseCase } from "../application/useCases/client/ProviderBookingsInfoUseCase.js";
const providerBookingsInfoUseCase = new ProviderBookingsInfoUseCase(userRepository)

import { BookingUseCase } from "../application/useCases/client/BookingUseCase.js";
const bookingUseCase = new BookingUseCase(bookingRepository,notificationService)

import { UpdateProfileUseCase } from "../application/useCases/client/UpdateProfileUseCase.js";
const updateProfileUseCase = new UpdateProfileUseCase(userRepository)

import { VerifyPasswordUseCase } from "../application/useCases/client/VerifyPasswordUseCase.js";
const verifyPasswordUseCase = new VerifyPasswordUseCase(userRepository, hashService, emailService)
/******************************************************************************************************************************************************
                                                        Provider Specific
******************************************************************************************************************************************************/
import { UpdateBookingStatusUseCase } from "../application/useCases/providers/UpdateBookingStatusUseCase.js";
const updateBookingStatusUseCase = new UpdateBookingStatusUseCase(bookingRepository,notificationService)



/******************************************************************************************************************************************************
                                                        Admin Specific
******************************************************************************************************************************************************/
import { GetCustomersUseCase } from "../application/useCases/admin/GetCustomersUseCase.js";
const getCustomersUseCase = new GetCustomersUseCase(userRepository)

import { ToggleUserStatusUseCase } from "../application/useCases/admin/ToggleUserStatusUseCase.js";
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepository)

import { GetProvidersUseCase } from "../application/useCases/admin/GetProvidersUseCase.js";
const getProvidersUseCase = new GetProvidersUseCase(providerRepository)

import { ProviderApplicationUseCase } from "../application/useCases/admin/ProviderApplicationUseCase.js";
const providerApplicationUseCase = new ProviderApplicationUseCase(kycRequestRepository)

import { UpdateKYCStatusUseCase } from "../application/useCases/admin/UpdateKYCStatusUseCase.js";
const updateKYCStatusUseCase = new UpdateKYCStatusUseCase(kycRequestRepository,providerRepository,userRepository)

import { GetServiceUseCase } from "../application/useCases/admin/GetServiceUseCase.js";
const getServiceUseCase = new GetServiceUseCase(categoryRepository)

import { CreateServiceCategoryUseCase } from "../application/useCases/admin/CreateServiceCategoryUseCase.js";
const createServiceCategoryUseCase = new CreateServiceCategoryUseCase(categoryRepository)

import { ToggleCategoryStatusUseCase } from "../application/useCases/admin/ToggleCategoryStatusUseCase.js";
const toggleCategoryStatusUseCase = new ToggleCategoryStatusUseCase(categoryRepository)


/******************************************************************************************************************************************************/
import { PublicController } from "../interfaces/controllers/PublicController.js";
import { AuthController } from "../interfaces/controllers/AuthController.js";
import { UserController } from "../interfaces/controllers/UserContoller.js";
import { AdminController } from "../interfaces/controllers/AdminController.js";
import { ProviderController } from "../interfaces/controllers/ProviderController.js";
import { BookingRepository } from "../infrastructure/database/repositories/BookingRepository.js";
import { NotificationService } from "../infrastructure/services/NotificationService.js";

const publicController = new PublicController(loggerService, getLandingDataUseCase)
const authController = new AuthController(loggerService, signupUseCase, verifySignupOtpUseCase, resendOtpUseCase, signinUseCase, googleSigninUseCase, forgotPasswordUseCase, resetPasswordUseCase, refreshTokenUseCase, signoutUseCase) 
const userController = new UserController( loggerService, activeServiceUseCase,getActiveProvidersUseCase,kycRequestUseCase,imageUploaderService,providerBookingsInfoUseCase,bookingUseCase,updateProfileUseCase,verifyPasswordUseCase,resetPasswordUseCase)
const providerController = new ProviderController(loggerService, updateBookingStatusUseCase)
const adminController = new AdminController(loggerService, getCustomersUseCase, toggleUserStatusUseCase, getProvidersUseCase, providerApplicationUseCase, updateKYCStatusUseCase, getServiceUseCase, createServiceCategoryUseCase, imageUploaderService, toggleCategoryStatusUseCase,)

export {
    publicController,
    authController,
    AuthMiddleware,
    userController,
    providerController,
    adminController
}
