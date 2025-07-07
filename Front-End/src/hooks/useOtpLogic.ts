import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { RoleEnum } from "@/shared/enums/roles";

export const useOtpLogic = () => {
  const navigate = useNavigate();

  const verifyOtp = async (otp: string): Promise<void> => {
    try {
      const res = await AuthService.VerifySignupOtp(otp);
      if (res.status === 200) {
        toast.success(res.data.message || " OTP verified successfully ! ");
        setTimeout(() => {
          navigate(`/signIn/${RoleEnum.CUSTOMER}`);
        }, 500);
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Failed to verify OTP. Please try again.";
      toast.error(errorMsg);
      if (error?.response?.status === 403) {
        navigate("/signup");
      }
    }
  };

  const resendOtp = async (): Promise<void> => {
    try {
      const res = await AuthService.resendOtpApi();
      if (res.status === 200) {
        toast.info(res.data.message || "OTP has been sent to your mail!");
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMsg);
    }
  };

  return { verifyOtp, resendOtp };
};
