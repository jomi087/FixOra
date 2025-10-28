import { UserRepository } from "../infrastructure/database/repositories/UserRepository";
import { OtpRepository } from "../infrastructure/database/repositories/OtpRepository";
import { CategoryRepository } from "../infrastructure/database/repositories/CategoryRepository";
import { KYCRequestRepository } from "../infrastructure/database/repositories/KYCRequestRepository";
import { ProviderRepository } from "../infrastructure/database/repositories/ProviderRepository";
import { BookingRepository } from "../infrastructure/database/repositories/BookingRepository";
import { WalletRepository } from "../infrastructure/database/repositories/WalletRepository";
import { NotificationRepository } from "../infrastructure/database/repositories/NotificationRepository";
import { AvailabilityRepository } from "../infrastructure/database/repositories/AvailabilityRepository";
import { RatingRepository } from "../infrastructure/database/repositories/RatingRepository";
import { PlatformFeeRepository } from "../infrastructure/database/repositories/PlatformFeeRepository";

import { WinstonLogger } from "../infrastructure/services/WinstonLoggerService";
import { EmailService } from "../infrastructure/services/EmailService";
import { OtpGenratorservice } from "../infrastructure/services/OtpGeneratorService";
import { HashService } from "../infrastructure/services/HashService";
import { TokenService } from "../infrastructure/services/TokenService";
import { GoogleOAuthService } from "../infrastructure/services/GoogleOAuthService";
import { ImageUploaderService } from "../infrastructure/services/ImageUploaderService";
import { NotificationService } from "../infrastructure/services/NotificationService";
import { PushNotificationService } from "../infrastructure/services/PushNotificationService";
import { BookingSchedulerService } from "../infrastructure/services/BookingSchedulerService";
import { PaymentService } from "../infrastructure/services/PaymentService";

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const categoryRepository = new CategoryRepository();
const kycRequestRepository = new KYCRequestRepository();
const providerRepository = new ProviderRepository();
const bookingRepository = new BookingRepository();
const walletRepository = new WalletRepository();
const notificationRepository = new NotificationRepository();
const availabilityRepository = new AvailabilityRepository();
const ratingRepository = new RatingRepository();
const platformFeeRepository = new PlatformFeeRepository();

const loggerService = new WinstonLogger();
const emailService = new EmailService();
const otpGenratorservice = new OtpGenratorservice();
const hashService = new HashService();
const tokenService = new TokenService();
const googleOAuthService = new GoogleOAuthService();
const imageUploaderService = new ImageUploaderService();
const notificationService = new NotificationService();
const pushNotificationService = new PushNotificationService();
const bookingSchedulerService = new BookingSchedulerService();
const paymentService = new PaymentService();


/******************************************************************************************************************************************************/
import { createAuthMiddleware } from "../interfaces/middleware/authMiddleware";
const AuthMiddleware = createAuthMiddleware(tokenService, userRepository);

import { createErrorHandler } from "../interfaces/middleware/errorHandler";
export const errorHandler = createErrorHandler(loggerService);

/******************************************************************************************************************************************************/
import { SignupUseCase } from "../application/useCases/auth/SignupUseCase";
const signupUseCase = new SignupUseCase(userRepository, otpRepository, emailService, otpGenratorservice, hashService);

import { VerifySignupOtpUseCase } from "../application/useCases/auth/VerifySignupOtpUseCase";
const verifySignupOtpUseCase = new VerifySignupOtpUseCase(otpRepository, userRepository, walletRepository);

import { ResendOtpUseCase } from "../application/useCases/auth/ResendOtpUseCase";
const resendOtpUseCase = new ResendOtpUseCase(otpRepository, otpGenratorservice, emailService);

import { configureAuthStrategies } from "../infrastructure/config/authSigninConfig";
const authFactory = configureAuthStrategies(userRepository, hashService);
import { SigninUseCase } from "../application/useCases/auth/SigninUseCase";
const signinUseCase = new SigninUseCase(authFactory, tokenService, userRepository);

import { GoogleSigninUseCase } from "../application/useCases/auth/GoogleSigninUseCase";
const googleSigninUseCase = new GoogleSigninUseCase(googleOAuthService, userRepository, tokenService);

import { ForgotPasswordUseCase } from "../application/useCases/auth/ForgotPasswordUseCase";
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);

import { ResetPasswordUseCase } from "../application/useCases/auth/ResetPasswordUseCase";
const resetPasswordUseCase = new ResetPasswordUseCase(hashService, userRepository);

import { RegisterFcmTokenUseCase } from "../application/useCases/auth/RegisterFcmTokenUseCase";
const registerFcmTokenUseCase = new RegisterFcmTokenUseCase(userRepository);

import { RefreshTokenUseCase } from "../application/useCases/auth/RefreshTokenUseCase";
const refreshTokenUseCase = new RefreshTokenUseCase(tokenService, userRepository);

import { configureSignOutStrategies } from "../infrastructure/config/SignoutConfig";
const signOutFactory = configureSignOutStrategies(userRepository);
import { SignoutUseCase } from "../application/useCases/auth/SignoutUseCase";
const signoutUseCase = new SignoutUseCase(signOutFactory);

/***************************************************************************************************************************************************** */
import { GetLandingDataUseCase } from "../application/useCases/public/GetLandingDataUseCase";
const getLandingDataUseCase = new GetLandingDataUseCase(categoryRepository);

import { GetNotificationsUseCase } from "../application/useCases/public/GetNotificationsUseCase";
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);

import { NotificationAcknowledgmentUseCase } from "../application/useCases/public/NotificationAcknowledgmentUseCase";
const notificationAcknowledgmentUseCase = new NotificationAcknowledgmentUseCase(notificationRepository);

/******************************************************************************************************************************************************
                                        Customer Specific
******************************************************************************************************************************************************/
import { ActiveServiceUseCase } from "../application/useCases/client/ActiveServiceUseCase";
const activeServiceUseCase = new ActiveServiceUseCase(categoryRepository);

import { GetActiveProvidersUseCase } from "../application/useCases/client/GetActiveProvidersUseCase";
const getActiveProvidersUseCase = new GetActiveProvidersUseCase(userRepository);

import { KYCRequestUseCase } from "../application/useCases/client/kYCRequestUseCase";
const kycRequestUseCase = new KYCRequestUseCase(imageUploaderService, kycRequestRepository, userRepository, notificationRepository, notificationService);

import { ProviderInfoUseCase } from "../application/useCases/client/ProviderInfoUseCase";
const providerInfoUseCase = new ProviderInfoUseCase(userRepository);

import { GetProviderReviewsUseCase } from "../application/useCases/client/GetProviderReviewsUseCase";
const getProviderReviewsUseCase = new GetProviderReviewsUseCase(ratingRepository);

import { UpdateFeedbackUseCase } from "../application/useCases/client/UpdateFeedbackUseCase";
const updateFeedbackUseCase = new UpdateFeedbackUseCase(ratingRepository);

import { BookingUseCase } from "../application/useCases/client/BookingUseCase";
const bookingUseCase = new BookingUseCase(bookingRepository, notificationService, pushNotificationService, bookingSchedulerService, userRepository, availabilityRepository);

import { CreatePaymentUseCase } from "../application/useCases/client/CreatePaymentUseCase";
const createPaymentUseCase = new CreatePaymentUseCase(paymentService, bookingRepository);

import { WalletPaymentUseCase } from "../application/useCases/client/WalletPaymentUseCase";
const walletPaymentUseCase = new WalletPaymentUseCase(bookingRepository, walletRepository, notificationService, notificationRepository, bookingSchedulerService);

import { VerifyPaymentUseCase } from "../application/useCases/client/VerifyPaymentUseCase";
const verifyPaymentUseCase = new VerifyPaymentUseCase(paymentService, notificationService, bookingRepository, walletRepository, bookingSchedulerService, notificationRepository);

import { UpdateProfileUseCase } from "../application/useCases/client/UpdateProfileUseCase";
const updateProfileUseCase = new UpdateProfileUseCase(userRepository);

import { VerifyPasswordUseCase } from "../application/useCases/client/VerifyPasswordUseCase";
const verifyPasswordUseCase = new VerifyPasswordUseCase(userRepository, hashService, emailService);

import { BookingHistoryUseCase } from "../application/useCases/client/BookingHistoryUseCase";
const bookingHistoryUseCase = new BookingHistoryUseCase(bookingRepository);

import { GetBookingDetailsUseCase } from "../application/useCases/client/GetBookingDetailsUseCase";
const getBookingDetailsUseCase = new GetBookingDetailsUseCase(bookingRepository);

import { RetryAvailabilityUseCase } from "../application/useCases/client/RetryAvailabilityUseCase";
const retryAvailabilityUseCase = new RetryAvailabilityUseCase(bookingRepository);

import { ReviewStatusUseCase } from "../application/useCases/client/ReviewStatusUseCase";
const reviewStatusUseCase = new ReviewStatusUseCase(ratingRepository);

import { CancelBookingUseCase } from "../application/useCases/client/CancelBookingUseCase";
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository, walletRepository, notificationService, notificationRepository, platformFeeRepository);

import { AddFeedbackUseCase } from "../application/useCases/client/AddFeedbackUseCase";
const addFeedbackUseCase = new AddFeedbackUseCase(ratingRepository, bookingRepository);

import { GetUserwalletInfoUseCase } from "../application/useCases/client/GetUserwalletInfoUseCase";
const getUserwalletInfoUseCase = new GetUserwalletInfoUseCase(walletRepository);

import { WalletTopupUseCase } from "../application/useCases/client/WalletTopupUseCase";
const walletTopUpUseCase = new WalletTopupUseCase(paymentService, walletRepository);

/******************************************************************************************************************************************************
                                        Provider Specific
******************************************************************************************************************************************************/
import { PendingBookingRequestUseCase } from "../application/useCases/providers/PendingBookingRequestUseCase";
const pendingBookingRequestUseCase = new PendingBookingRequestUseCase(bookingRepository);

import { UpdateBookingStatusUseCase } from "../application/useCases/providers/UpdateBookingStatusUseCase";
const updateBookingStatusUseCase = new UpdateBookingStatusUseCase(bookingRepository, notificationService, bookingSchedulerService);

import { GetConfirmBookingsUseCase } from "../application/useCases/providers/GetConfirmBookingsUseCase";
const getConfirmBookingsUseCase = new GetConfirmBookingsUseCase(bookingRepository);

import { GetJobDetailsUseCase } from "../application/useCases/providers/GetJobDetailsUseCase";
const getJobDetailsUseCase = new GetJobDetailsUseCase(bookingRepository);

import { JobHistoryUseCase } from "../application/useCases/providers/JobHistoryUseCase";
const jobHistoryUseCase = new JobHistoryUseCase(bookingRepository);

import { VerifyArrivalUseCase } from "../application/useCases/providers/VerifyArrivalUseCase";
const verifyArrivalUseCase = new VerifyArrivalUseCase(bookingRepository, userRepository, otpGenratorservice, otpRepository, emailService, tokenService);

import { VerifyArrivalOtpUseCase } from "../application/useCases/providers/VerifyArrivalOtpUseCase";
const verifyArrivalOtpUseCase = new VerifyArrivalOtpUseCase(otpRepository, tokenService, bookingRepository);

import { WorkCompletionUseCase } from "../application/useCases/providers/WorkCompletionUseCase";
const workCompletionUseCase = new WorkCompletionUseCase(imageUploaderService, bookingRepository, walletRepository, notificationService, notificationRepository, platformFeeRepository);

import { ProviderServiceUseCase } from "../application/useCases/providers/ProviderServiceUseCase";
const providerServiceUseCase = new ProviderServiceUseCase(providerRepository, categoryRepository);

import { ProviderServiceInfoUseCase } from "../application/useCases/providers/ProviderServiceInfoUseCase";
const providerServiceInfoUseCase = new ProviderServiceInfoUseCase(providerRepository);

import { ProviderDataUpdateUseCase } from "../application/useCases/providers/ProviderDataUpdateUseCase";
const providerDataUpdateUseCase = new ProviderDataUpdateUseCase(providerRepository);

import { GetAvailabilityUseCase } from "../application/useCases/providers/GetAvailabilityUseCase";
const getAvailabilityUseCase = new GetAvailabilityUseCase(providerRepository, availabilityRepository);

import { SetAvailabilityUseCase } from "../application/useCases/providers/SetAvailabilityUseCase";
const setAvailabilityUseCase = new SetAvailabilityUseCase(providerRepository, availabilityRepository);

import { ToggleAvailabilityUseCase } from "../application/useCases/providers/ToggleAvailabilityUseCase";
const toggleAvailabilityUseCase = new ToggleAvailabilityUseCase(providerRepository, availabilityRepository, bookingRepository, walletRepository, notificationService, notificationRepository);

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
const updateKYCStatusUseCase = new UpdateKYCStatusUseCase(kycRequestRepository, providerRepository, userRepository);

import { GetServiceUseCase } from "../application/useCases/admin/GetServiceUseCase";
const getServiceUseCase = new GetServiceUseCase(categoryRepository);

import { CreateServiceCategoryUseCase } from "../application/useCases/admin/CreateServiceCategoryUseCase";
const createServiceCategoryUseCase = new CreateServiceCategoryUseCase(categoryRepository);

import { ToggleCategoryStatusUseCase } from "../application/useCases/admin/ToggleCategoryStatusUseCase";
const toggleCategoryStatusUseCase = new ToggleCategoryStatusUseCase(categoryRepository);

import { PlatformFeeUseCase } from "../application/useCases/admin/PlatformFeeUseCase";
const platformFeeUseCase = new PlatformFeeUseCase(platformFeeRepository);

import { UpdatePlatformFeeUseCase } from "../application/useCases/admin/UpdatePlatformFeeUseCase";
const updatePlatformFeeUseCase = new UpdatePlatformFeeUseCase(platformFeeRepository);
/******************************************************************************************************************************************************/
import { PublicController } from "../interfaces/controllers/PublicController";
import { AuthController } from "../interfaces/controllers/AuthController";
import { UserController } from "../interfaces/controllers/UserContoller";
import { AdminController } from "../interfaces/controllers/AdminController";
import { ProviderController } from "../interfaces/controllers/ProviderController";


const publicController = new PublicController(getLandingDataUseCase, getNotificationsUseCase, notificationAcknowledgmentUseCase);

const authController = new AuthController(signupUseCase, verifySignupOtpUseCase, resendOtpUseCase, signinUseCase, googleSigninUseCase, forgotPasswordUseCase, resetPasswordUseCase, registerFcmTokenUseCase, refreshTokenUseCase, signoutUseCase);

const userController = new UserController(activeServiceUseCase, getActiveProvidersUseCase, kycRequestUseCase, providerInfoUseCase, getProviderReviewsUseCase, updateFeedbackUseCase, bookingUseCase, createPaymentUseCase, walletPaymentUseCase, verifyPaymentUseCase, updateProfileUseCase, verifyPasswordUseCase, resetPasswordUseCase, bookingHistoryUseCase, getBookingDetailsUseCase, retryAvailabilityUseCase, reviewStatusUseCase, cancelBookingUseCase, addFeedbackUseCase, getUserwalletInfoUseCase, walletTopUpUseCase );

const providerController = new ProviderController(pendingBookingRequestUseCase, updateBookingStatusUseCase, getConfirmBookingsUseCase, getJobDetailsUseCase, jobHistoryUseCase, verifyArrivalUseCase, verifyArrivalOtpUseCase, workCompletionUseCase, providerServiceUseCase, providerServiceInfoUseCase, providerDataUpdateUseCase, getAvailabilityUseCase, setAvailabilityUseCase, toggleAvailabilityUseCase);

const adminController = new AdminController(getCustomersUseCase, toggleUserStatusUseCase, getProvidersUseCase, providerApplicationUseCase, updateKYCStatusUseCase, getServiceUseCase, createServiceCategoryUseCase, imageUploaderService, toggleCategoryStatusUseCase, platformFeeUseCase, updatePlatformFeeUseCase );

export {
    publicController,
    authController,
    AuthMiddleware,
    userController,
    providerController,
    adminController
};
