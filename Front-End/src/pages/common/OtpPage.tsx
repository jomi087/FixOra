import Header from "../../components/common/layout/Header"; 
import Otp from "../../components/auth/Otp";
import { BGImage_404 } from "../../utils/constant";
import { useOtpLogic } from "@/hooks/useOtpLogic";


const OtpPage: React.FC = () => {

  const { verifyOtp, resendOtp } = useOtpLogic();
  return (
    <>
      <Header className="md:text-start" />
      <div className="min-h-screen flex items-center justify-center bg-cover  p-4"  style={{ backgroundImage: BGImage_404 }}>
        <Otp otpTime={30} otpLength={6} otpSubmit={verifyOtp}  resendOtp={resendOtp}  />
      </div>
    </>
  );
};

export default OtpPage;