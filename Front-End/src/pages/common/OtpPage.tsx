import Header from '../../components/common/layout/Header' 
import Otp from '../../components/common/auth/Otp';
import { BGImage_404 } from "../../utils/constant";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RoleEnum } from '../../../shared/enums/roles';
import AuthService from '../../services/AuthService';


const OtpPage: React.FC = () => {
    const navigate = useNavigate();

    const verifyOtp = async (otp: string): Promise<void> => {
        try {
            const res = await AuthService.VerifySignupOtp({otp});

            console.log("OTP submitted:", res);
            if ( res.status == 200 ) { 
                toast.success(res.data.message || " OTP verified successfully ! ");
                setTimeout(() => {
                    navigate(`/signIn/${RoleEnum.CUSTOMER}`); // Redirect to sign-in page after successful verification
                }, 1000);
            }

        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || "Failed to verify OTP. Please try again.";
            toast.error(errorMsg);
            if(error?.response?.status === 403) {
                navigate('/signup');
            }
        }
    }
    
    const resendOtp = async (): Promise<void> => {
        try {
            const res = await AuthService.resendOtpApi();
            //console.log("OTP resent:", res);
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