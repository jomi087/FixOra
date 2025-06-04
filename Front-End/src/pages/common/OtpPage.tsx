import Header from '../../components/common/layout/Header' 
import Otp from '../../components/common/auth/Otp';
import { accountVerificationWithOtpApi, BGImage_404, resendOtpApi } from "../../utils/constant";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const OtpPage: React.FC = () => {
    const navigate = useNavigate();

    const verifyOtp = async (otp: string): Promise<void> => {
        try {
            const res = await axios.post(accountVerificationWithOtpApi, { otp }, {
                headers: {
                "Content-Type": "application/json"
                },
                withCredentials: true  
            });

            console.log("OTP submitted:", res);

            if ( res.status == 200 ) { 
                toast.success(res.data.message || " OTP verified successfully ! ");
                setTimeout(() => {
                    navigate('/signIn');
                }, 1000);
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to verify OTP. Please try again.";
            toast.error(errorMsg);
            if(error?.response?.status === 401) {
                navigate('/signup');
            }
        }
    }
    const resendOtp = async (): Promise<void> => {
        try {
            const res = await axios.get( resendOtpApi, {
                withCredentials: true  
            });

            // console.log("OTP resent:", res);
            if (res.status === 200) {
                toast.info( res.data.message || "OTP has been sent to your mail!");
            }
            
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to resend OTP. Please try again.";
            toast.error(errorMsg);
        }
    }

    return (
        <>
            <Header className="md:text-start" />
            <div className="min-h-screen flex items-center justify-center bg-cover  p-4"  style={{ backgroundImage: BGImage_404 }}>
                <Otp otpTime={30} otpLength={6} otpSubmit={verifyOtp}  resendOtp={resendOtp}  />
            </div>
        </>
    )
}

export default OtpPage