import { UserRepository } from "../infrastructure/database/repositories/UserRepository";
import { OtpRepository } from "../infrastructure/database/repositories/OtpRepository";
import { CategoryRepository } from "../infrastructure/database/repositories/CategoryRepository";
import { KYCRequestRepository } from "../infrastructure/database/repositories/KYCRequestRepository";
import { ProviderRepository } from "../infrastructure/database/repositories/ProviderRepository";
import { BookingRepository } from "../infrastructure/database/repositories/BookingRepository";
import { WalletRepository } from "../infrastructure/database/repositories/WalletRepository";

import { WinstonLogger } from "../infrastructure/services/WinstonLoggerService";
import { EmailService } from "../infrastructure/services/EmailService";
import { OtpGenratorservice } from "../infrastructure/services/OtpGeneratorService";
import { HashService } from "../infrastructure/services/HashService";
import { TokenService } from "../infrastructure/services/TokenService";
import { GoogleOAuthService } from "../infrastructure/services/GoogleOAuthService";
import { ImageUploaderService } from "../infrastructure/services/ImageUploaderService";
import { NotificationService } from "../infrastructure/services/NotificationService";
import { BookingSchedulerService } from "../infrastructure/services/BookingSchedulerService";
import { PaymentService } from "../infrastructure/services/PaymentService";

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const categoryRepository = new CategoryRepository();
const kycRequestRepository = new KYCRequestRepository();
const providerRepository = new ProviderRepository();
const bookingRepository = new BookingRepository();
const walletRepository = new WalletRepository();

const loggerService = new WinstonLogger();
const emailService = new EmailService(); 
const otpGenratorservice = new OtpGenratorservice();
const hashService = new HashService();
const tokenService = new TokenService();
const googleOAuthService = new GoogleOAuthService();
const imageUploaderService = new ImageUploaderService();
const notificationService = new NotificationService();
const bookingSchedulerService = new BookingSchedulerService();
const paymentService = new PaymentService();

/******************************************************************************************************************************************************/
import { createAuthMiddleware } from "../interfaces/middleware/authMiddleware";
const AuthMiddleware = createAuthMiddleware(tokenService, userRepository);

import { createErrorHandler } from "../interfaces/middleware/errorHandler";
export const errorHandler = createErrorHandler(loggerService);

/******************************************************************************************************************************************************/
import { SignupUseCase } from "../application/useCases/auth/SignupUseCase";
const signupUseCase = new SignupUseCase(userRepository, otpRepository, emailService, otpGenratorservice, hashService ); 

import { VerifySignupOtpUseCase } from "../application/useCases/auth/VerifySignupOtpUseCase";
const verifySignupOtpUseCase = new VerifySignupOtpUseCase(otpRepository, userRepository, walletRepository);

import { ResendOtpUseCase } from "../application/useCases/auth/ResendOtpUseCase";
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, otpGenratorservice, emailService);

import { configureAuthStrategies } from "../infrastructure/config/authSigninConfig";
const authFactory = configureAuthStrategies(userRepository, hashService);
import { SigninUseCase } from "../application/useCases/auth/SigninUseCase";
const signinUseCase = new SigninUseCase(authFactory, tokenService, userRepository);

import { GoogleSigninUseCase } from "../application/useCases/auth/GoogleSigninUseCase";
const googleSigninUseCase = new GoogleSigninUseCase(googleOAuthService,userRepository,tokenService);

import { ForgotPasswordUseCase } from "../application/useCases/auth/ForgotPasswordUseCase";
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository,emailService );

import { ResetPasswordUseCase } from "../application/useCases/auth/ResetPasswordUseCase";
const resetPasswordUseCase = new ResetPasswordUseCase(hashService,userRepository);

import { RefreshTokenUseCase } from "../application/useCases/auth/RefreshTokenUseCase";
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userRepository);

import { GetLandingDataUseCase } from "../application/useCases/public/GetLandingDataUseCase";
const getLandingDataUseCase = new GetLandingDataUseCase(categoryRepository);

import { SignoutUseCase } from "../application/useCases/auth/SignoutUseCase";
const signoutUseCase = new SignoutUseCase(userRepository);

/******************************************************************************************************************************************************
                                                        Customer Specific
******************************************************************************************************************************************************/
import { ActiveServiceUseCase } from "../application/useCases/client/ActiveServiceUseCase";
const activeServiceUseCase = new ActiveServiceUseCase(categoryRepository);

import { GetActiveProvidersUseCase } from "../application/useCases/client/GetActiveProvidersUseCase";
const getActiveProvidersUseCase = new GetActiveProvidersUseCase(userRepository);

import { KYCRequestUseCase } from "../application/useCases/client/kYCRequestUseCase";
const kycRequestUseCase = new KYCRequestUseCase(kycRequestRepository);

import { ProviderInfoUseCase } from "../application/useCases/client/ProviderInfoUseCase";
const providerInfoUseCase = new ProviderInfoUseCase(userRepository);

import { BookingUseCase } from "../application/useCases/client/BookingUseCase";
const bookingUseCase = new BookingUseCase(bookingRepository,notificationService,bookingSchedulerService,userRepository);

import { CreatePaymentUseCase } from "../application/useCases/client/CreatePaymentUseCase";
const createPaymentUseCase = new CreatePaymentUseCase(paymentService,bookingRepository);

import { WalletPaymentUseCase } from "../application/useCases/client/WalletPaymentUseCase";
const walletPaymentUseCase = new WalletPaymentUseCase(bookingRepository,walletRepository,notificationService,bookingSchedulerService);

import { VerifyPaymentUseCase } from "../application/useCases/client/VerifyPaymentUseCase";
const verifyPaymentUseCase = new VerifyPaymentUseCase(paymentService,notificationService,bookingRepository,walletRepository,bookingSchedulerService);

import { UpdateProfileUseCase } from "../application/useCases/client/UpdateProfileUseCase";
const updateProfileUseCase = new UpdateProfileUseCase(userRepository);

import { VerifyPasswordUseCase } from "../application/useCases/client/VerifyPasswordUseCase";
const verifyPasswordUseCase = new VerifyPasswordUseCase(userRepository, hashService, emailService);

import { BookingHistoryUseCase } from "../application/useCases/client/BookingHistoryUseCase";
const bookingHistoryUseCase = new BookingHistoryUseCase(bookingRepository);

import { GetBookingDetailsUseCase } from "../application/useCases/client/GetBookingDetailsUseCase";
const getBookingDetailsUseCase = new GetBookingDetailsUseCase(bookingRepository);

import { GetUserwalletInfoUseCase } from "../application/useCases/client/GetUserwalletInfoUseCase";
const getUserwalletInfoUseCase = new GetUserwalletInfoUseCase(walletRepository);

import { WalletTopupUseCase } from "../application/useCases/client/WalletTopupUseCase";  
const walletTopUpUseCase = new WalletTopupUseCase(paymentService, walletRepository);
/******************************************************************************************************************************************************
                                                        Provider Specific
******************************************************************************************************************************************************/
import { UpdateBookingStatusUseCase } from "../application/useCases/providers/UpdateBookingStatusUseCase";
const updateBookingStatusUseCase = new UpdateBookingStatusUseCase(bookingRepository,notificationService,bookingSchedulerService);

import { GetConfirmBookingsUseCase } from "../application/useCases/providers/GetConfirmBookingsUseCase";
const getConfirmBookingsUseCase = new GetConfirmBookingsUseCase(bookingRepository);

import { GetJobDetailsUseCase } from "../application/useCases/providers/GetJobDetailsUseCase";
const getJobDetailsUseCase = new GetJobDetailsUseCase(bookingRepository);

import { JobHistoryUseCase } from "../application/useCases/providers/JobHistoryUseCase";
const jobHistoryUseCase = new JobHistoryUseCase(bookingRepository);
/******************************************************************************************************************************************************
                                                        Admin Specific
******************************************************************************************************************************************************/
import { GetCustomersUseCase } from "../application/useCases/admin/GetCustomersUseCase";
const getCustomersUseCase = new GetCustomersUseCase(userRepository);

import { ToggleUserStatusUseCase } from "../application/useCases/admin/ToggleUserStatusUseCase";
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepository);

import { GetProvidersUseCase } from "../application/useCases/admin/GetProvidersUseCase";
const getProvidersUseCase = new GetProvidersUseCase(providerRepository);

import { ProviderApplicationUseCase } from "../application/useCases/admin/ProviderApplicationUseCase";
const providerApplicationUseCase = new ProviderApplicationUseCase(kycRequestRepository);

import { UpdateKYCStatusUseCase } from "../application/useCases/admin/UpdateKYCStatusUseCase";
const updateKYCStatusUseCase = new UpdateKYCStatusUseCase(kycRequestRepository,providerRepository,userRepository);

import { GetServiceUseCase } from "../application/useCases/admin/GetServiceUseCase";
const getServiceUseCase = new GetServiceUseCase(categoryRepository);

import { CreateServiceCategoryUseCase } from "../application/useCases/admin/CreateServiceCategoryUseCase";
const createServiceCategoryUseCase = new CreateServiceCategoryUseCase(categoryRepository);

import { ToggleCategoryStatusUseCase } from "../application/useCases/admin/ToggleCategoryStatusUseCase";
const toggleCategoryStatusUseCase = new ToggleCategoryStatusUseCase(categoryRepository);



/******************************************************************************************************************************************************/
import { PublicController } from "../interfaces/controllers/PublicController";
import { AuthController } from "../interfaces/controllers/AuthController";
import { UserController } from "../interfaces/controllers/UserContoller";
import { AdminController } from "../interfaces/controllers/AdminController";
import { ProviderController } from "../interfaces/controllers/ProviderController";

const publicController = new PublicController(loggerService, getLandingDataUseCase);
const authController = new AuthController(loggerService, signupUseCase, verifySignupOtpUseCase, resendOtpUseCase, signinUseCase, googleSigninUseCase, forgotPasswordUseCase, resetPasswordUseCase, refreshTokenUseCase, signoutUseCase); 
const userController = new UserController( loggerService, activeServiceUseCase,getActiveProvidersUseCase,kycRequestUseCase,imageUploaderService,providerInfoUseCase,bookingUseCase,createPaymentUseCase,walletPaymentUseCase,verifyPaymentUseCase,updateProfileUseCase,verifyPasswordUseCase,resetPasswordUseCase,bookingHistoryUseCase,getBookingDetailsUseCase,getUserwalletInfoUseCase,walletTopUpUseCase);
const providerController = new ProviderController(loggerService, updateBookingStatusUseCase, getConfirmBookingsUseCase,getJobDetailsUseCase,jobHistoryUseCase);
const adminController = new AdminController(loggerService, getCustomersUseCase, toggleUserStatusUseCase, getProvidersUseCase, providerApplicationUseCase, updateKYCStatusUseCase, getServiceUseCase, createServiceCategoryUseCase, imageUploaderService, toggleCategoryStatusUseCase,);

export {
    publicController,
    authController,
    AuthMiddleware,
    userController,
    providerController,
    adminController
};
