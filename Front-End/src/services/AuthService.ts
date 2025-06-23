import axiosInstance from './axiosConfig';
import type { Signup, Signin } from "../../shared/Types/user";


class AuthService {  
    getBearerTokenConfig(token?: string) {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token||""}`

            },
        };
    }
    
    //!  i have alredy cofigure axios with repeated option and backend Url so that the resone some of api request not having options and baseUrl

    signupApi(Data: Signup) {
        return axiosInstance.post('/api/auth/signup', Data);
    }

    resendOtpApi() {
        return axiosInstance.get("/api/auth/resend-otp");
    }

    VerifySignupOtp(Data: string ) {
        return axiosInstance.post('/api/auth/verify-otp', { otpData : Data });
    }

    signinApi(Data: Signin) {
        return axiosInstance.post('/api/auth/signin', Data);
    }

    googleSigninApi(data: { code: string, role: string }) {
    return axiosInstance.post('/api/auth/google-signin', data);
    }

    forgotPasswordApi(email: string) {
        return axiosInstance.post('/api/auth/forgot-password', { email })
    }

    resetPasswordApi( token: string, password: string, cPassword: string ) {
        return axiosInstance.post('/api/auth/reset-password', {token ,password,cPassword,})
    }

    checkAuthStatus() {
        return axiosInstance.get("/api/auth/check");
    }

    signoutApi(token?:string) {
        return axiosInstance.post("/api/auth/signout",{}, this.getBearerTokenConfig(token));
    }

}


export default new AuthService()