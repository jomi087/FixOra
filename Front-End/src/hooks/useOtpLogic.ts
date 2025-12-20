import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { RoleEnum } from "@/shared/enums/Role";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";

export const useOtpLogic = () => {
  const navigate = useNavigate();

  const verifyOtp = async (otp: string): Promise<void> => {
    try {
      const res = await AuthService.VerifySignupOtpApi(otp);
      if (res.status === HttpStatusCode.OK) {
        toast.success(res.data.message || Messages.OTP_VERIFIED_SUCCESS );
        setTimeout(() => {
          navigate(`/signIn/${RoleEnum.CUSTOMER}`);
        }, 500);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.OTP_VERIFICATION_FAILED ;
      toast.error(errorMsg);
      if (error?.response?.status === 403) {
        navigate("/signup");
      }
    }
  };

  const resendOtp = async (): Promise<void> => {
    try {
      const res = await AuthService.resendOtpApi();
      if (res.status === HttpStatusCode.OK) {
        toast.info(res.data.message || Messages.OTP_SENT_SUCCESS );
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.OTP_RESENT_FAILED ;
      toast.error(errorMsg);
    }
  };

  return { verifyOtp, resendOtp };
};
