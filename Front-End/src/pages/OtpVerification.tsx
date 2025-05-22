

import Header from '../components/common/layout/Header' 
import Otp from '../components/common/Others/Otp';
import { BGImage_404 } from "../utils/constant";


const OtpVerification: React.FC = () => {
  
    
    return (
        <>
            <Header className="md:text-start"/>
            <Otp otpTime={30} otpLength={6} bgImage={BGImage_404 } />
        </>
    )
}

export default OtpVerification