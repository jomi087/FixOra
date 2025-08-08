import type { KYCStatus } from '@/shared/enums/KycStatus';
import axiosInstance from './axiosConfig';
import type { ProfileEdit, Signin, Signup } from '@/shared/Types/user';

class AuthService {  
    getBearerTokenConfig(token?: string) {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token||""}`

            },
        };
    }

    getJsonConfig() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    getMultiPartConfig() {
        return {
            headers: {
                'Content-Type' : 'multipart/form-data',
            }
       }
    }
    
    //#  i have alredy cofigure axios with repeated option and backend Url so that the resone some of api request not having options and baseUrl
    /*********************************************************************************************************************** */
    
    getLandingDataApi() {
        return axiosInstance.get('/api/public/landing-data')
    }
    
    signupApi(Data: Signup) {
        return axiosInstance.post('/api/auth/signup', Data , this.getJsonConfig());
    }

    resendOtpApi() {
        return axiosInstance.get("/api/auth/resend-otp");
    }

    VerifySignupOtpApi(Data: string ) {
        return axiosInstance.post('/api/auth/verify-otp', { otpData : Data } , this.getJsonConfig());
    }

    signinApi(Data: Signin) {
        return axiosInstance.post('/api/auth/signin', Data , this.getJsonConfig());
    }

    googleSigninApi(data: { code: string, role: string }) {
        return axiosInstance.post('/api/auth/google-signin', data , this.getJsonConfig());
    }

    forgotPasswordApi(email: string) {
        return axiosInstance.post('/api/auth/forgot-password', { email } , this.getJsonConfig())
    }

    resetPasswordApi( token: string, password: string, cPassword: string ) {
        return axiosInstance.patch('/api/auth/reset-password', {token ,password,cPassword,} , this.getJsonConfig())
    }

    checkAuthStatusApi() {
        return axiosInstance.get("/api/auth/check");
    }
    /*********************************************************************************************************************** */

    getActiveServicesApi() {
        return axiosInstance.get('/api/user/services')
    }

    getAuthProvidersApi(params: { searchQuery: string, filter: string, currentPage: number, itemsPerPage: number, selectedService?: string; nearByFilter?: string, ratingFilter?: string, availabilityFilter?: string }) {
        return axiosInstance.get(`/api/user/providers`,{ params })
    }

    providerKYCApi(data : FormData) {
        return axiosInstance.post('/api/user/provider-kyc', data, this.getMultiPartConfig())
    }

    providerBookingsInfoApi(id: string) {
        return axiosInstance.get(`/api/user/provider/bookings/${id}`)
    }

    BookingApplicationApi(payload : { providerId: string, providerUserId : string, fullDate: string; time: string; issueTypeId: string; issue: string; }) {
        return axiosInstance.post(`/api/user/provider/booking`,payload,this.getJsonConfig())
    }

    editProfileApi(form: ProfileEdit) {
        return axiosInstance.patch("/api/user/editProfile", form , this.getJsonConfig())
    }

    verifyPasswordApi(password:string) {
        return axiosInstance.post("/api/user/verifyPassword",{password} , this.getJsonConfig())
    }

    changePasswordApi( token: string, password: string, cPassword: string ) {
        return axiosInstance.patch('/api/user/change-password', {token ,password,cPassword,} , this.getJsonConfig())
    }

    /*********************************************************************************************************************** */




    /*********************************************************************************************************************** */
    getCustomerApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
        return axiosInstance.get("/api/admin/customer-management", {
            params: { searchQuery, filter, currentPage, itemsPerPage }
        });
    }

    toggleUserStatusApi(userId: string) {
        return axiosInstance.patch(`/api/admin/customer-management/${userId}`)
    }


    getAllProviderApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
        return axiosInstance.get(`/api/admin/provider-management`,{
           params: { searchQuery, filter, currentPage, itemsPerPage }
        })
    }

    getProviderApplicationList(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
        return axiosInstance.get('/api/admin/provider-applicationList', {
            params : {searchQuery, filter, currentPage, itemsPerPage}
        })
    }

    updateProviderKYC(id: string, payload: { action: KYCStatus , reason?: string }) {
        return axiosInstance.patch(`/api/admin/provider-kyc/${id}`,payload, this.getJsonConfig())
    }

    getCategoryApi(searchQuery: string, filter: string, currentPage: number, itemsPerPage: number) {
        return axiosInstance.get(`/api/admin/service-management`, {
            params: { searchQuery, filter, currentPage, itemsPerPage }
        })
    }

    addCategoryApi(data: FormData) {
        return axiosInstance.post(`/api/admin/service-management`,data,this.getMultiPartConfig())
    }

    toggleCategoryStatusApi(categoryId: string) {
        return axiosInstance.patch(`/api/admin/service-management/${categoryId}`)
    }

/*********************************************************************************************************************** */
    signoutApi(token?:string) {
        return axiosInstance.post("/api/auth/signout",{}, this.getBearerTokenConfig(token));
    }


}


export default new AuthService()