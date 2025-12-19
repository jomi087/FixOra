import { DisputeType } from "../shared/enums/Dispute";
import { allowedTypes, maxSizeMB } from "../shared/const/constants";


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
import { CommissionFeeRepository } from "../infrastructure/database/repositories/CommissionFeeRepository";
import { DisputeRepository } from "../infrastructure/database/repositories/DisputeRepository";
import { ChatMessageRepository } from "../infrastructure/database/repositories/ChatMessageRepository";
import { ChatRepository } from "../infrastructure/database/repositories/ChatRepository";


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
import { ChatService } from "../infrastructure/services/ChatService";
import { OlaGeocodeService } from "../infrastructure/services/GeocodeService";
import { CallService } from "../infrastructure/services/CallService";

import { FileValidationService } from "../infrastructure/services/FileValidationService";
import { ReviewDisputeContentHandler } from "../application/useCases/admin/handlers/ReviewDisputeContentHandler";
import { ReviewDisputeActionHandler } from "../application/useCases/admin/handlers/DisputeActionHandler";

// Data-access Repositories
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
const commissionFeeRepository = new CommissionFeeRepository();
const disputeRepository = new DisputeRepository();
const chatRepository = new ChatRepository();
const chatMessageRepository = new ChatMessageRepository();

// business/technical service 
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
const chatService = new ChatService();
const callService = new CallService();
const geocodeService = new OlaGeocodeService();

//validatior
const fileValidatonService = new FileValidationService(allowedTypes, maxSizeMB);

// strategy handler,
const reviewHandler = new ReviewDisputeContentHandler(ratingRepository);
const reviewActionHandler = new ReviewDisputeActionHandler(ratingRepository);

// import { MongooseTransactionManager } from "../infrastructure/database/mongooseTransactionManager";
// const transactionManager = new MongooseTransactionManager();
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

import { configureSignOutStrategies } from "../infrastructure/config/signoutConfig";
const signOutFactory = configureSignOutStrategies(userRepository);
import { SignoutUseCase } from "../application/useCases/auth/SignoutUseCase";
const signoutUseCase = new SignoutUseCase(signOutFactory);

/***************************************************************************************************************************************************** */
import { GetLandingDataUseCase } from "../application/useCases/public/GetLandingDataUseCase";
const getLandingDataUseCase = new GetLandingDataUseCase(categoryRepository, bookingRepository);

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

import { UpdateSelectedLocationUseCase } from "../application/useCases/client/UpdateSelectedLocationUseCase";
const updateSelectedLocationUseCase = new UpdateSelectedLocationUseCase(userRepository);

import { KYCRequestUseCase } from "../application/useCases/client/kYCRequestUseCase";
const kycRequestUseCase = new KYCRequestUseCase(imageUploaderService, kycRequestRepository, userRepository, notificationRepository, notificationService);

import { ProviderInfoUseCase } from "../application/useCases/client/ProviderInfoUseCase";
const providerInfoUseCase = new ProviderInfoUseCase(userRepository);

import { GetProviderReviewsUseCase } from "../application/useCases/client/GetProviderReviewsUseCase";
const getProviderReviewsUseCase = new GetProviderReviewsUseCase(ratingRepository);

import { UpdateReviewUseCase } from "../application/useCases/client/UpdateReviewUseCase";
const updateReviewUseCase = new UpdateReviewUseCase(ratingRepository);

import { CreateDisputeAndNotifyUseCase } from "../application/useCases/client/CreateDisputeAndNotifyUseCase";
const createDisputeAndNotifyUseCase = new CreateDisputeAndNotifyUseCase(disputeRepository, userRepository, emailService);

import { BookingUseCase } from "../application/useCases/client/BookingUseCase";
const bookingUseCase = new BookingUseCase(bookingRepository, notificationService, pushNotificationService, bookingSchedulerService, userRepository, availabilityRepository, commissionFeeRepository);

import { RescheduleBookingUseCase } from "../application/useCases/client/RescheduleBookingUseCase";
const rescheduleBookingUseCase = new RescheduleBookingUseCase(bookingRepository, availabilityRepository, notificationService, notificationRepository);

import { CreatePaymentUseCase } from "../application/useCases/client/CreatePaymentUseCase";
const createPaymentUseCase = new CreatePaymentUseCase(paymentService, bookingRepository);

import { WalletPaymentUseCase } from "../application/useCases/client/WalletPaymentUseCase";
const walletPaymentUseCase = new WalletPaymentUseCase(bookingRepository, walletRepository, notificationService, notificationRepository, bookingSchedulerService);

import { VerifyPaymentUseCase } from "../application/useCases/client/VerifyPaymentUseCase";
const verifyPaymentUseCase = new VerifyPaymentUseCase(paymentService, notificationService, bookingRepository, walletRepository, bookingSchedulerService, notificationRepository);

import { RequestEmailUpdateUseCase } from "../application/useCases/client/RequestEmailUpdateUseCase";
const requestEmailUpdateUseCase = new RequestEmailUpdateUseCase(userRepository, otpGenratorservice, otpRepository, emailService);

import { ConfirmEmailUpdateUseCase } from "../application/useCases/client/ConfirmEmailUpdateUseCase";
const confirmEmailUpdateUseCase = new ConfirmEmailUpdateUseCase(otpRepository, userRepository);

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
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository, walletRepository, notificationService, notificationRepository);

import { AddReviewUseCase } from "../application/useCases/client/AddReviewUseCase";
const addReviewUseCase = new AddReviewUseCase(ratingRepository, bookingRepository);

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
const workCompletionUseCase = new WorkCompletionUseCase(imageUploaderService, bookingRepository, walletRepository, notificationService, notificationRepository);

import { ProviderServiceUseCase } from "../application/useCases/providers/ProviderServiceUseCase";
const providerServiceUseCase = new ProviderServiceUseCase(providerRepository, categoryRepository);

import { ProviderServiceInfoUseCase } from "../application/useCases/providers/ProviderServiceInfoUseCase";
const providerServiceInfoUseCase = new ProviderServiceInfoUseCase(providerRepository);

import { ProviderDataUpdateUseCase } from "../application/useCases/providers/ProviderDataUpdateUseCase";
const providerDataUpdateUseCase = new ProviderDataUpdateUseCase(providerRepository);

import { GetAvailabilityUseCase } from "../application/useCases/providers/GetAvailabiltyUseCase";
const getAvailabilityUseCase = new GetAvailabilityUseCase(providerRepository, availabilityRepository);

import { SetAvailabilityUseCase } from "../application/useCases/providers/SetAvailabilityUseCase";
const setAvailabilityUseCase = new SetAvailabilityUseCase(providerRepository, availabilityRepository, bookingRepository, walletRepository, notificationService, notificationRepository);

import { ToggleAvailabilityUseCase } from "../application/useCases/providers/ToggleAvailabilityUseCase";
const toggleAvailabilityUseCase = new ToggleAvailabilityUseCase(providerRepository, availabilityRepository, bookingRepository, walletRepository, notificationService, notificationRepository);

import { GetSalesReportUseCase } from "../application/useCases/providers/GetSalesReportUseCase";
const getSalesReportUseCase = new GetSalesReportUseCase(bookingRepository);
/******************************************************************************************************************************************************
                                        Admin Specific
******************************************************************************************************************************************************/
import { DashboardReportUseCase } from "../application/useCases/admin/DashboardReportUseCase";
const dashboardReportUseCase = new DashboardReportUseCase(userRepository, categoryRepository, bookingRepository);

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

import { UpdateCategoryUseCase } from "../application/useCases/admin/UpdateCategoryUseCase";
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository, imageUploaderService, fileValidatonService);

import { UpdateSubCategoryUseCase } from "../application/useCases/admin/UpdateSubCategoryUseCase";
const updateSubCategoryUseCase = new UpdateSubCategoryUseCase(categoryRepository, imageUploaderService, fileValidatonService);

import { GetDisputesUseCase } from "../application/useCases/admin/GetDisputesUseCase";
const getDisputesUseCase = new GetDisputesUseCase(disputeRepository);

import { DisputeContentInfoUseCase } from "../application/useCases/admin/DisputeContentInfoUseCase";
const disputeContentInfoUseCase = new DisputeContentInfoUseCase(disputeRepository, { [DisputeType.REVIEW]: reviewHandler });

import { DisputeActionUseCase } from "../application/useCases/admin/DisputeActionUseCase";
const disputeActionUseCase = new DisputeActionUseCase(disputeRepository, { [DisputeType.REVIEW]: reviewActionHandler }, userRepository /* transactionManager */);

import { CommissionFeeUseCase } from "../application/useCases/admin/CommissionFeeUseCase";
const commissionFeeUseCase = new CommissionFeeUseCase(commissionFeeRepository);

import { UpdateCommissionFeeUseCase } from "../application/useCases/admin/UpdateCommissionFeeUseCase";
const updateCommissionFeeUseCase = new UpdateCommissionFeeUseCase(commissionFeeRepository);
/******************************************************************************************************************************************************
                                        Chat Specific
******************************************************************************************************************************************************/
import { StartChatUseCase } from "../application/useCases/chat/StartChatUseCase";
const startChatUseCase = new StartChatUseCase(chatRepository);

import { GetUserChatsUseCase } from "../application/useCases/chat/GetUserChatsUseCase";
const getUserChatsUseCase = new GetUserChatsUseCase(chatRepository);

import { GetChatMessagesUseCase } from "../application/useCases/chat/GetChatMessagesUseCase ";
const getChatMessagesUseCase = new GetChatMessagesUseCase(chatMessageRepository);

import { SendChatMessageUseCase } from "../application/useCases/chat/SendChatMessageUseCase";
const sendChatMessageUseCase = new SendChatMessageUseCase(chatRepository, chatMessageRepository, imageUploaderService, fileValidatonService);

import { LogCallUseCase } from "../application/useCases/chat/LogCallUseCase";
const logCallUseCase = new LogCallUseCase(chatRepository, chatMessageRepository);
/******************************************************************************************************************************************************
                                        Geo-coding
******************************************************************************************************************************************************/
import { ReverseGeocodeUseCase } from "../application/useCases/geocode/ola/ReverseGeocodeUseCase";
const reverseGeocodeUseCase = new ReverseGeocodeUseCase(geocodeService);

import { ForwardGeocodeUseCase } from "../application/useCases/geocode/ola/ForwardGeocodeUseCase";
const forwardGeocodeUseCase = new ForwardGeocodeUseCase(geocodeService);

import { AutocompleteGeocodeUseCase } from "../application/useCases/geocode/ola/AutocompleteGeocodeUseCase";
const autocompleteGeocodeUseCase = new AutocompleteGeocodeUseCase(geocodeService);

/******************************************************************************************************************************************************/

import { PublicController } from "../interfaces/controllers/PublicController";
import { AuthController } from "../interfaces/controllers/AuthController";
import { UserController } from "../interfaces/controllers/UserContoller";
import { AdminController } from "../interfaces/controllers/AdminController";
import { ProviderController } from "../interfaces/controllers/ProviderController";
import { ChatController } from "../interfaces/controllers/ChatController";
import { GeocodeController } from "../interfaces/controllers/GeocodeController";


const publicController = new PublicController(getLandingDataUseCase, getNotificationsUseCase, notificationAcknowledgmentUseCase);

const authController = new AuthController(signupUseCase, verifySignupOtpUseCase, resendOtpUseCase, signinUseCase, googleSigninUseCase, forgotPasswordUseCase, resetPasswordUseCase, registerFcmTokenUseCase, refreshTokenUseCase, signoutUseCase);

const userController = new UserController(activeServiceUseCase, getActiveProvidersUseCase, updateSelectedLocationUseCase, kycRequestUseCase, providerInfoUseCase, getProviderReviewsUseCase, updateReviewUseCase, createDisputeAndNotifyUseCase, bookingUseCase, rescheduleBookingUseCase, createPaymentUseCase, walletPaymentUseCase, verifyPaymentUseCase, requestEmailUpdateUseCase, confirmEmailUpdateUseCase, updateProfileUseCase, verifyPasswordUseCase, resetPasswordUseCase, bookingHistoryUseCase, getBookingDetailsUseCase, retryAvailabilityUseCase, reviewStatusUseCase, cancelBookingUseCase, addReviewUseCase, getUserwalletInfoUseCase, walletTopUpUseCase);

const providerController = new ProviderController(pendingBookingRequestUseCase, updateBookingStatusUseCase, getConfirmBookingsUseCase, getJobDetailsUseCase, jobHistoryUseCase, verifyArrivalUseCase, verifyArrivalOtpUseCase, workCompletionUseCase, providerServiceUseCase, providerServiceInfoUseCase, providerDataUpdateUseCase, getAvailabilityUseCase, setAvailabilityUseCase, toggleAvailabilityUseCase, getSalesReportUseCase);

const adminController = new AdminController(dashboardReportUseCase, getCustomersUseCase, toggleUserStatusUseCase, getProvidersUseCase, providerApplicationUseCase, updateKYCStatusUseCase, getServiceUseCase, createServiceCategoryUseCase, imageUploaderService, toggleCategoryStatusUseCase, updateCategoryUseCase, updateSubCategoryUseCase, getDisputesUseCase, disputeContentInfoUseCase, disputeActionUseCase, commissionFeeUseCase, updateCommissionFeeUseCase);

const chatController = new ChatController(startChatUseCase, getUserChatsUseCase, getChatMessagesUseCase, sendChatMessageUseCase, logCallUseCase, chatService, callService);

const geocodeController = new GeocodeController(reverseGeocodeUseCase, forwardGeocodeUseCase, autocompleteGeocodeUseCase);

export {
    publicController,
    authController,
    AuthMiddleware,
    userController,
    providerController,
    adminController,
    chatController,
    geocodeController,
};
