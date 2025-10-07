import type { Day, LeaveOption } from "@/shared/Types/availability";
import axiosInstance from "./axiosConfig";
import type { ProfileEdit, Signin, Signup } from "@/shared/Types/user";
import type { KYCStatus } from "@/shared/enums/KycStatus";
import type { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";

class AuthService {
  getBearerTokenConfig(token?: string) {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`
      },
    };
  }

  getJsonConfig() {
    return {
      headers: {
        "Content-Type": "application/json"
      }
    };
  }

  getMultiPartConfig() {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    };
  }

  //#  i have alredy cofigure axios with repeated option and backend Url so that the resone some of api request not having options and baseUrl
  /*********************************************************************************************************************** */

  getLandingDataApi() {
    return axiosInstance.get("/api/landing-data");
  }

  getNotificationsApi() {
    return axiosInstance.get("/api/notifications");
  }

  acknowledgeNotificationAPI(notificationId: string) {
    return axiosInstance.patch(`/api/notification/acknowledge/${notificationId}`);
  }

  signupApi(Data: Signup) {
    return axiosInstance.post("/api/auth/signup", Data, this.getJsonConfig());
  }

  resendOtpApi() {
    return axiosInstance.get("/api/auth/resend-otp");
  }

  VerifySignupOtpApi(Data: string) {
    return axiosInstance.post("/api/auth/verify-otp", { otpData: Data }, this.getJsonConfig());
  }

  signinApi(Data: Signin) {
    return axiosInstance.post("/api/auth/signin", Data, this.getJsonConfig());
  }

  googleSigninApi(data: { code: string, role: string }) {
    return axiosInstance.post("/api/auth/google-signin", data, this.getJsonConfig());
  }

  forgotPasswordApi(email: string) {
    return axiosInstance.post("/api/auth/forgot-password", { email }, this.getJsonConfig());
  }

  resetPasswordApi(token: string, password: string, cPassword: string) {
    return axiosInstance.patch("/api/auth/reset-password", { token, password, cPassword, }, this.getJsonConfig());
  }

  checkAuthStatusApi() {
    return axiosInstance.get("/api/auth/check");
  }
  /*********************************************************************************************************************** */
  //Customer
  getActiveServicesApi() {
    return axiosInstance.get("/api/customer/services");
  }

  getAuthProvidersApi(params: { searchQuery: string, filter: string, currentPage: number, itemsPerPage: number, selectedService?: string; nearByFilter?: string, ratingFilter?: string, availabilityFilter?: string }) {
    return axiosInstance.get("/api/customer/providers", { params });
  }

  providerKYCApi(data: FormData) {
    return axiosInstance.post("/api/customer/provider-kyc", data, this.getMultiPartConfig());
  }

  providerInfoApi(id: string) {
    return axiosInstance.get(`/api/customer/provider/bookings/${id}`);
  }

  bookingApplicationApi(payload: { providerId: string, providerUserId: string, scheduledAt: Date; issueTypeId: string; issue: string; }) {
    return axiosInstance.post("/api/customer/provider/booking", payload, this.getJsonConfig());
  }

  onlinePaymentApi(bookingId: string) {
    return axiosInstance.post("/api/customer/create-checkout-session", { bookingId }, this.getJsonConfig());
  }

  walletPaymentApi(bookingId: string) {
    return axiosInstance.post("/api/customer/wallet-payment", { bookingId }, this.getJsonConfig());
  }

  checkBookingPaymentStatus(bookingId: string) {
    return axiosInstance.get(`/api/customer/booking/notify-paymentStatus/${bookingId}`);
  }

  editProfileApi(form: ProfileEdit) {
    return axiosInstance.patch("/api/customer/editProfile", form, this.getJsonConfig());
  }

  verifyPasswordApi(password: string) {
    return axiosInstance.post("/api/customer/verifyPassword", { password }, this.getJsonConfig());
  }

  changePasswordApi(token: string, password: string, cPassword: string) {
    return axiosInstance.patch("/api/customer/change-password", { token, password, cPassword, }, this.getJsonConfig());
  }

  bookingHistoryApi(currentPage: number, itemsPerPage: number) {
    return axiosInstance.get("/api/customer/booking-history", {
      params: { currentPage, itemsPerPage }
    });
  }

  bookingDetailsApi(bookingId: string) {
    return axiosInstance.get(`/api/customer/bookingDetails/${bookingId}`);
  }

  retryAvailabilityApi(bookingId: string) {
    return axiosInstance.patch(`/api/customer/booking/retry-availability/${bookingId}`);
  }

  cancelBookingApi(bookingId: string) {
    return axiosInstance.patch(`/api/customer/booking/cancel-booking/${bookingId}`);
  }

  getReviewStatus(bookingId: string) {
    return axiosInstance.get(`/api/customer/booking/review-status/${bookingId}`);
  }

  updateFeedbackApi(payload: { bookingId: string, rating: number, feedback: string }) {
    return axiosInstance.post("/api/customer/booking/feedback", payload, this.getJsonConfig());
  }

  userWalletInfoApi(page: number, limit: number) {
    return axiosInstance.get(`/api/customer/wallet?page=${page}&limit=${limit}`);
  }

  addFundApi(amount: number) {
    return axiosInstance.post("/api/customer/wallet/add-fund", { amount }, this.getJsonConfig());
  }

  /*********************************************************************************************************************** */
  //Provider
  UpdateBookingStatusApi(bookingId: string, action: Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING>, reason: string) {
    return axiosInstance.patch(`/api/provider/booking/${bookingId}/status`, {
      action,
      reason
    });
  }

  providerBookingsInfoApi() {
    return axiosInstance.get("/api/provider/confirm-bookings");
  }

  jobDetailsApi(bookingId: string) {
    return axiosInstance.get(`/api/provider/jobDetails/${bookingId}`);
  }

  providerJobHistoryApi(currentPage: number, itemsPerPage: number) {
    return axiosInstance.get("/api/provider/job-history", {
      params: { currentPage, itemsPerPage }
    });
  }

  arrivalOtpApi(bookingId: string) {
    return axiosInstance.post(`/api/provider/arrival-otp/${bookingId}`);
  }

  verifyArrivalOtpApi(otp: string) {
    return axiosInstance.post("api/provider/verify-arrivalOtp", { otp }, this.getJsonConfig());
  }

  finalizeBookingApi(data: FormData) {
    return axiosInstance.post("/api/provider/acknowledge-completion", data, this.getMultiPartConfig());
  }

  workingTimeInfoApi() {
    return axiosInstance.get("/api/provider/availability-time");
  }

  scheduleWorkTimeAPi(schedule: Record<Day, { slots: string[], active: boolean }>) {
    return axiosInstance.post("api/provider/schedule-availability-time", { schedule }, this.getJsonConfig());
  }

  toggleAvailability(day: string, leaveOption?: LeaveOption) {
    return axiosInstance.patch("api/provider/toggle-availability", { day, leaveOption });
  }

  /*********************************************************************************************************************** */
  //Admin
  getCustomerApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get("/api/admin/customer-management", {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  toggleUserStatusApi(userId: string) {
    return axiosInstance.patch(`/api/admin/customer-management/${userId}`);
  }

  getAllProviderApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get("/api/admin/provider-management", {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  getProviderApplicationList(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get("/api/admin/provider-applicationList", {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  updateProviderKYC(id: string, payload: { action: KYCStatus, reason?: string }) {
    return axiosInstance.patch(`/api/admin/provider-kyc/${id}`, payload, this.getJsonConfig());
  }

  getCategoryApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
    return axiosInstance.get("/api/admin/service-management", {
      params: { searchQuery, filter, currentPage, itemsPerPage }
    });
  }

  addCategoryApi(data: FormData) {
    return axiosInstance.post("/api/admin/service-management", data, this.getMultiPartConfig());
  }

  toggleCategoryStatusApi(categoryId: string) {
    return axiosInstance.patch(`/api/admin/service-management/${categoryId}`);
  }

  /*********************************************************************************************************************** */
  signoutApi(token?: string) {
    return axiosInstance.post("/api/auth/signout", {}, this.getBearerTokenConfig(token));
  }


}


export default new AuthService();