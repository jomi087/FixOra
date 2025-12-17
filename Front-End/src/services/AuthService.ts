import type { Day, LeaveOption } from "@/shared/types/availability";
import axiosInstance from "./axiosConfig";
import type { ProfileEdit, ServiceData, Signin, Signup } from "@/shared/types/user";
import type { KYCStatus } from "@/shared/enums/KycStatus";
import type { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";
import { API_ROUTES } from "@/utils/constant";
import type { Platform } from "@/shared/types/others";
import type { SalesPreset } from "@/shared/types/salesReport";
import type { TimeRange } from "@/shared/types/dashboard";
import type { DisputeContentResponse, DisputeListPayload, DisputeListResponse } from "@/shared/types/dispute";
import type { AxiosResponse } from "axios";
import type { DisputeStatus } from "@/shared/enums/Dispute";
import { RoleEnum } from "@/shared/enums/roles";
import type { AppLocation } from "@/shared/types/location";

class AuthService {
  getJsonConfig() {
    return {
      headers: {
        "Content-Type": "application/json"
      }
    };
  }

  //#  i have alredy cofigure axios with repeated option and backend Url so that the resone some of api request not having options and baseUrl
  /*********************************************************************************************************************** */
  getLandingDataApi() {
    return axiosInstance.get(API_ROUTES.LANDING.GET_DATA);
  }

  getNotificationsApi() {
    return axiosInstance.get(API_ROUTES.NOTIFICATIONS.GET_ALL);
  }

  getChats(role: RoleEnum, searchQuery?: string) {
    return axiosInstance.get(API_ROUTES.CHAT.LIST(role), {
      params: searchQuery?.trim() ? { searchQuery } : {}
    });
  }

  getChatMessages(role: RoleEnum, chatId: string, page: number, limit: number) {
    return axiosInstance.get(API_ROUTES.CHAT.MESSAGES(role, chatId), {
      params: { page, limit }
    });
  }

  logCall(role: RoleEnum, chatId: string, payload: { callerId: string, status: string }) {
    return axiosInstance.post(API_ROUTES.CHAT.CALL_LOGS(role, chatId), payload);
  }

  sendChatMessages(role: RoleEnum, chatId: string, content: string) {
    return axiosInstance.post(API_ROUTES.CHAT.MESSAGES(role, chatId), { content });
  }

  /*********************************************************************************************************************** */

  acknowledgeNotificationAPI(notificationId: string) {
    // return axiosInstance.patch(`/api/notification/acknowledge/${notificationId}`);
    return axiosInstance.patch(API_ROUTES.NOTIFICATIONS.ACKNOWLEDGE(notificationId));
  }

  signupApi(data: Signup) {
    return axiosInstance.post(API_ROUTES.AUTH.SIGNUP, data, this.getJsonConfig());
  }

  resendOtpApi(email?: string) {
    return axiosInstance.post(API_ROUTES.AUTH.RESEND_OTP, { email });
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

  reverseGeocode(lat: number, lng: number) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.REVERSE_GEOCODE, {
      params: { lat, lng }
    });
  }

  autoCompleteSearch(address: string) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.AUTO_COMPLETE_SEARCH, {
      params: { address }
    });
  }

  forwardGeocode(address: string) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.FORWARD_GEOCODE, {
      params: { address }
    });
  }

  getAuthProvidersApi(params: {
    searchQuery: string, filter: string,
    currentPage: number, itemsPerPage: number,
    selectedService?: string;
    nearByFilter?: string, ratingFilter?: string, availabilityFilter?: string,
  }) {
    return axiosInstance.get(API_ROUTES.CUSTOMER.PROVIDERS, { params });
  }

  saveLocation(loc: AppLocation) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.SAVE_LOCATION, loc);
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

  updateFeedbackApi(payload: { ratingId: string, rating: number, feedback: string }) {
    return axiosInstance.patch(API_ROUTES.CUSTOMER.FEEDBACK, payload, this.getJsonConfig());
  }

  reportReview(payload: { ratingId: string, reason: string }) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.REPORT_FEEDBACK, payload, this.getJsonConfig());
  }

  bookingApplicationApi(payload: { providerId: string, providerUserId: string, scheduledAt: Date; issueTypeId: string; issue: string; }) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.BOOKING_APPLICATION, payload, this.getJsonConfig());
  }

  rescheduleBooking(bookingId: string, rescheduledAt: Date) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.RESCHEDULE_BOOKING(bookingId), { rescheduledAt });
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

  updateEmail(email: string) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.UPDATE_EMAIL_REQUEST, { email });
  }

  verifyUpdateEmail(otp: string, email: string) {
    return axiosInstance.post(API_ROUTES.CUSTOMER.UPDATE_EMAIL, { otp, newEmail: email });
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

  startChatWithProvider(providerUserId: string) {
    return axiosInstance.post(API_ROUTES.CHAT.LIST(RoleEnum.CUSTOMER), { userId: providerUserId });
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

  addFeedbackApi(payload: { bookingId: string, rating: number, feedback: string }) {
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

  startChatWithUser(userId: string) {
    return axiosInstance.post(API_ROUTES.CHAT.LIST(RoleEnum.PROVIDER), { userId: userId });
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

  salesReport(filter: SalesPreset | null, startDate: string | null, endDate: string | null) {
    return axiosInstance.get(API_ROUTES.PROVIDER.SALES_REPORT(filter, startDate, endDate));
  }

  /*********************************************************************************************************************** */
  //Admin
  DashboardData(timeRange: TimeRange) {
    return axiosInstance.get(API_ROUTES.ADMIN.DASHBOARD(timeRange));
  }

  getCustomerApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get(API_ROUTES.ADMIN.CUSTOMER_MANAGEMENT, {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  toggleUserStatusApi(userId: string) {
    return axiosInstance.patch(API_ROUTES.ADMIN.TOGGLE_USER_STATUS(userId));
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

  updateCategory(data: FormData, categoryId: string) {
    return axiosInstance.patch(API_ROUTES.ADMIN.UPDATE_MAIN_CATEGORY(categoryId), data);
  }

  updateSubCategory(data: FormData, subCategoryId: string) {
    return axiosInstance.patch(API_ROUTES.ADMIN.UPDATE_SUB_CATEGORY(subCategoryId), data);
  }


  toggleCategoryStatusApi(categoryId: string) {
    return axiosInstance.patch(API_ROUTES.ADMIN.TOGGLE_CATEGORY_STATUS(categoryId));
  }

  getDispute(payload: DisputeListPayload): Promise<AxiosResponse<DisputeListResponse>> {
    return axiosInstance.get(API_ROUTES.ADMIN.DISPUTE_MANAGEMENT, { params: { ...payload } });
  }

  getDisputeContentById(disputeId: string): Promise<AxiosResponse<DisputeContentResponse>> {
    return axiosInstance.get(API_ROUTES.ADMIN.DISPUTE_CONTENT_INFO(disputeId));
  }

  disputeAction(disputeId: string, reason: string, status: DisputeStatus) {
    return axiosInstance.patch(API_ROUTES.ADMIN.DISPUTE_ACTION(disputeId), { reason, status });
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

  commissionFee() {
    return axiosInstance.get(API_ROUTES.ADMIN.COMMISSION_FEE);
  }

  updateCommissionFee(commissionFee: number) {
    return axiosInstance.patch(API_ROUTES.ADMIN.COMMISSION_FEE, { commissionFee });
  }

  /*********************************************************************************************************************** */

  signoutApi(fcmToken: string | null) {
    return axiosInstance.post(API_ROUTES.AUTH.SIGNOUT, { fcmToken }, this.getJsonConfig());
  }

}


export default new AuthService();