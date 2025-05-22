import Header from '../../components/common/layout/Header' 
import Otp from '../../components/common/auth/Otp';
import { BGImage_404 } from "../../utils/constant";


const OtpPage: React.FC = () => {
    return (
        <>
            <Header className="md:text-start" />
            <div className="min-h-screen flex items-center justify-center bg-cover  p-4"  style={{ backgroundImage: BGImage_404 }}>
                <Otp otpTime={30} otpLength={6} />
            </div>
        </>
    )
}

export default OtpPage