import type { Day, LeaveOption } from "@/shared/types/availability";
import axiosInstance from "./axiosConfig";
import type { ProfileEdit, ServiceData, Signin, Signup } from "@/shared/types/user";
import type { KYCStatus } from "@/shared/enums/KycStatus";
import type { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";
import { API_ROUTES } from "@/utils/constant";
import type { Platform } from "@/shared/types/others";

class AuthService {
  // getBearerTokenConfig(token?: string) { //jwt token
  //   return {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token || ""}`
  //     },
  //   };
  // }

  getJsonConfig() {
    return {
      headers: {
        "Content-Type": "application/json"
      }
    };
  }

  // getMultiPartConfig() {
  //   return {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     }
  //   };
  // }

  //#  i have alredy cofigure axios with repeated option and backend Url so that the resone some of api request not having options and baseUrl
  /*********************************************************************************************************************** */
  getLandingDataApi() {
    return axiosInstance.get(API_ROUTES.LANDING.GET_DATA);
  }

  getNotificationsApi() {
    return axiosInstance.get(API_ROUTES.NOTIFICATIONS.GET_ALL);
  }

  acknowledgeNotificationAPI(notificationId: string) {
    // return axiosInstance.patch(`/api/notification/acknowledge/${notificationId}`);
    return axiosInstance.patch(API_ROUTES.NOTIFICATIONS.ACKNOWLEDGE(notificationId));

  }

  signupApi(data: Signup) {
    return axiosInstance.post(API_ROUTES.AUTH.SIGNUP, data, this.getJsonConfig());
  }

  resendOtpApi() {
    return axiosInstance.get(API_ROUTES.AUTH.RESEND_OTP);
  }

  VerifySignupOtpApi(Data: string) {
    return axiosInstance.post(API_ROUTES.AUTH.VERIFY_OTP, { otpData: Data }, this.getJsonConfig());
  }

  signinApi(Data: Signin) {
    return axiosInstance.post(API_ROUTES.AUTH.SIGNIN, Data, this.getJsonConfig());
  }

  registerToken(FcmToken: string, platform: Platform) {
    return axiosInstance.post("/api/auth/register-fcm-token", {
      FcmToken,
      platform,
    }, this.getJsonConfig());
  }

  googleSigninApi(data: { code: string, role: string }) {
    return axiosInstance.post(API_ROUTES.AUTH.GOOGLE_SIGNIN, data, this.getJsonConfig());
  }

  forgotPasswordApi(email: string) {
    return axiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email }, this.getJsonConfig());
  }

  resetPasswordApi(token: string, password: string, cPassword: string) {
    return axiosInstance.patch(API_ROUTES.AUTH.RESET_PASSWORD, { token, password, cPassword, }, this.getJsonConfig());
  }

  checkAuthStatusApi() {
    return axiosInstance.get(API_ROUTES.AUTH.CHECK_STATUS);
  }
  /*********************************************************************************************************************** */
  //Customer
  getActiveServicesApi() {
    return axiosInstance.get(API_ROUTES.CUSTOMER.SERVICES);
  }

  getAuthProvidersApi(params: { searchQuery: string, filter: string, currentPage: number, itemsPerPage: number, selectedService?: string; nearByFilter?: string, ratingFilter?: string, availabilityFilter?: string }) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.PROVIDERS, { params });
  }

  providerKYCApi(data: FormData) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.PROVIDER_KYC, data);
  }

  providerInfoApi(id: string) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.PROVIDER_BOOKINGS(id));
  }

  providerReviewApi(id: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.PROVIDER_REVIEWS(id), {
      params: { currentPage, itemsPerPage },
    });
  }

  bookingApplicationApi(payload: { providerId: string, providerUserId: string, scheduledAt: Date; issueTypeId: string; issue: string; }) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.BOOKING_APPLICATION, payload, this.getJsonConfig());
  }

  onlinePaymentApi(bookingId: string) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.ONLINE_PAYMENT, { bookingId }, this.getJsonConfig());
  }

  walletPaymentApi(bookingId: string) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.WALLET_PAYMENT, { bookingId }, this.getJsonConfig());
  }

  checkBookingPaymentStatus(bookingId: string) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.PAYMENT_STATUS(bookingId));
  }

  editProfileApi(form: ProfileEdit) {
    return axiosInstance.patch(API_ROUTES.CUSTOMER.EDIT_PROFILE, form, this.getJsonConfig());
  }

  verifyPasswordApi(password: string) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.VERIFY_PASSWORD, { password }, this.getJsonConfig());
  }

  changePasswordApi(token: string, password: string, cPassword: string) {
    return axiosInstance.patch(API_ROUTES.CUSTOMER.CHANGE_PASSWORD, { token, password, cPassword, }, this.getJsonConfig());
  }

  bookingHistoryApi(currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.BOOKING_HISTORY, {
      params: { currentPage, itemsPerPage }
    });
  }

  bookingDetailsApi(bookingId: string) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.BOOKING_DETAILS(bookingId));
  }

  retryAvailabilityApi(bookingId: string) {
    return axiosInstance.patch(API_ROUTES.CUSTOMER.RETRY_AVAILABILITY(bookingId));
  }

  cancelBookingApi(bookingId: string) {
    return axiosInstance.patch(API_ROUTES.CUSTOMER.CANCEL_BOOKING(bookingId));
  }

  getReviewStatus(bookingId: string) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.REVIEW_STATUS(bookingId));
  }

  updateFeedbackApi(payload: { bookingId: string, rating: number, feedback: string }) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.FEEDBACK, payload, this.getJsonConfig());
  }

  userWalletInfoApi(page: number, limit: number) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.WALLET_INFO(page, limit));
  }

  addFundApi(amount: number) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.ADD_FUND, { amount }, this.getJsonConfig());
  }


  /*********************************************************************************************************************** */
  //Provider
  pendingRequestApi() {
    return axiosInstance.get(API_ROUTES.PROVIDER.PENDING_BOOKING_REQUEST);
  }

  UpdateBookingStatusApi(bookingId: string, action: Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING>, reason: string) {
    return axiosInstance.patch(API_ROUTES.PROVIDER.UPDATE_BOOKING_STATUS(bookingId), {
      action,
      reason
    });
  }

  providerBookingsInfoApi() {
    return axiosInstance.get(API_ROUTES.PROVIDER.CONFIRM_BOOKINGS);
  }

  jobDetailsApi(bookingId: string) {
    return axiosInstance.get(API_ROUTES.PROVIDER.JOB_DETAILS(bookingId));
  }

  providerJobHistoryApi(currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.PROVIDER.JOB_HISTORY, {
      params: { currentPage, itemsPerPage }
    });
  }

  arrivalOtpApi(bookingId: string) {
    return axiosInstance.post(API_ROUTES.PROVIDER.ARRIVAL_OTP(bookingId));
  }

  verifyArrivalOtpApi(otp: string) {
    return axiosInstance.post(API_ROUTES.PROVIDER.VERIFY_ARRIVAL_OTP, { otp }, this.getJsonConfig());
  }

  finalizeBookingApi(data: FormData) {
    return axiosInstance.post(API_ROUTES.PROVIDER.FINALIZE_BOOKING, data);
  }

  // verifyPasswordApi(password: string) {
  //   return axiosInstance.post(API_ROUTES.ADMIN.VERIFY_PASSWORD, { password }, this.getJsonConfig());
  // }

  // changePasswordApi(token: string, password: string, cPassword: string) {
  //   return axiosInstance.patch(API_ROUTES.ADMIN.CHANGE_PASSWORD, { token, password, cPassword, }, this.getJsonConfig());
  // }

  getServiceApi() {
    return axiosInstance.get(API_ROUTES.PROVIDER.PROVIDERSERVICES);
  }

  providerDataApi() {
    return axiosInstance.get(API_ROUTES.PROVIDER.PROVIDER_DATA);
  }

  updateProviderDataApi(payload: Pick<ServiceData, "serviceCharge" | "category">) {
    return axiosInstance.patch(API_ROUTES.PROVIDER.PROVIDER_DATA, payload);
  }

  workingTimeInfoApi() {
    return axiosInstance.get(API_ROUTES.PROVIDER.WORKING_TIME_INFO);
  }

  scheduleWorkTimeAPi(schedule: Record<Day, { slots: string[], active: boolean }>) {
    return axiosInstance.post(API_ROUTES.PROVIDER.SCHEDULE_WORK_TIME, { schedule }, this.getJsonConfig());
  }

  toggleAvailability(day: string, leaveOption?: LeaveOption) {
    return axiosInstance.patch(API_ROUTES.PROVIDER.TOGGLE_AVAILABILITY, { day, leaveOption });
  }



  /*********************************************************************************************************************** */
  //Admin
  getCustomerApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.ADMIN.CUSTOMER_MANAGEMENT, {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  toggleUserStatusApi(userId: string) {
    return axiosInstance.patch(API_ROUTES.ADMIN.TOGGLE_CUSTOMER_STATUS(userId));
  }

  getAllProviderApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.ADMIN.PROVIDER_MANAGEMENT, {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  getProviderApplicationList(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.ADMIN.PROVIDER_APPLICATION_LIST, {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  updateProviderKYC(id: string, payload: { action: KYCStatus, reason?: string }) {
    return axiosInstance.patch(API_ROUTES.ADMIN.PROVIDER_KYC(id), payload, this.getJsonConfig());
  }

  getCategoryApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.ADMIN.CATEGORY_MANAGEMENT, {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  addCategoryApi(data: FormData) {
    return axiosInstance.post(API_ROUTES.ADMIN.CATEGORY_MANAGEMENT, data);
  }

  toggleCategoryStatusApi(categoryId: string) {
    return axiosInstance.patch(API_ROUTES.ADMIN.TOGGLE_CATEGORY_STATUS(categoryId));
  }

  // editProfileApi(form: ProfileEdit) {
  //   return axiosInstance.patch(API_ROUTES.ADMIN.EDIT_PROFILE, form, this.getJsonConfig());
  // }

  // verifyPasswordApi(password: string) {
  //   return axiosInstance.post(API_ROUTES.ADMIN.VERIFY_PASSWORD, { password }, this.getJsonConfig());
  // }

  // changePasswordApi(token: string, password: string, cPassword: string) {
  //   return axiosInstance.patch(API_ROUTES.ADMIN.CHANGE_PASSWORD, { token, password, cPassword, }, this.getJsonConfig());
  // }


  /*********************************************************************************************************************** */

  signoutApi(fcmToken: string | null) {
    return axiosInstance.post(API_ROUTES.AUTH.SIGNOUT, { fcmToken }, this.getJsonConfig());
  }

}


export default new AuthService();