import axios from "axios"
import type { Signup, Signin } from "../../shared/Types/user";


class AuthService {
    url = import.meta.env.VITE_API_URL;

    configJson =  {
        headers: {
          "Content-Type": "application/json"
        }
    }

    configJsonWithCredentials =  {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
    }


    signup(Data:Signup,) {
        return axios.post( this.url+'/api/auth/signup',Data,this.configJsonWithCredentials )
    }

    signin(Data: Signin) {
        return axios.post( this.url+'/api/auth/signin',Data,this.configJsonWithCredentials )
    }

    accountVerificationWithOtp(Data: { otp: string }) {
        return axios.post( this.url+'/api/auth/verify-otp',Data,this.configJsonWithCredentials )
    }

    resendOtpApi() {
        return axios.get(this.url + "/api/auth/resend-otp", this.configJsonWithCredentials);
    }

}


export default new AuthService()