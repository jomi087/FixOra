import  { useEffect, useState } from "react";
import { BiCheck, BiRefresh } from "react-icons/bi";

import Header from '../components/common/Header'
import { BGImage_404, OTP_LENGTH, OTP_TIME } from "../utils/constant";


const OtpVerification: React.FC = () => {
    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
    const [timer, setTimer] = useState(OTP_TIME);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = e.target.value
        if (!/^[0-9]?$/.test(value)) return;
        let newOtp = [...otp]
        newOtp[idx] = value
        setOtp(newOtp)

        if (value && idx < 5) {
            const nextInput = document.getElementsByClassName('otp_input')[idx+1]as HTMLInputElement | undefined
            nextInput?.focus()
        }
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        
        if (e.key === 'Backspace') {
            console.log(idx)
            if (otp[idx]) {
                const newOtp = [...otp]
                newOtp[idx] = "";
                setOtp(newOtp)
            } else if (idx > 0) {
                const nextInput = document.getElementsByClassName('otp_input')[idx-1]as HTMLInputElement | undefined
                nextInput?.focus()
            }
        }
    }

    const handleResendOtp = () => {
        setTimer(OTP_TIME)
        setOtp(new Array(OTP_LENGTH).fill(''))
    }

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1 )
        }, 1000);
        return () => clearInterval(interval);
    }, [timer])
    
    return (
        <>
            <Header className="md:text-start"/>
            <div className="min-h-screen flex items-center justify-center bg-cover  p-4"  style={{ backgroundImage: BGImage_404 }}>
                {/* otp component  start*/}
                <div className="bg-white rounded-xl shadow-2xl shadow-gray-700 w-full max-w-md p-6">
                    <h2 className="text-2xl font-bold text-center mb-2">OTP Verification</h2>
                    <p className="text-gray-600 text-center mb-4">
                    Please enter the 6-digit code sent to your email.
                    </p>

                    <div className="flex justify-between mb-4" role="group" aria-labelledby="otp-heading">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            className="otp_input w-10 h-12 border border-gray-300 rounded-md text-center text-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={value}
                            aria-label={`Digit ${index + 1} of 6 for OTP`}
                            autoFocus = { index == 0 }
                            maxLength={1} //to avoid multiple numbers
                            inputMode = 'numeric' //to show a numeric keypad for mobile user
                            onChange={(e) => { handleOtpChange(e, index) }} //react event  handlers only pass one argument  then is event /e
                            onKeyDown={(e)=>{ handleKeyDown(e,index)}}
                        />
                    ))}
                    </div>

                    <div className="text-center text-gray-500 mb-4">
                        Time remaining: <span className="font-semibold">{timer}</span> seconds
                    </div>

                    <div className="flex justify-between items-center gap-4">
                    <button
                        type= 'button'   
                        className={`flex items-center gap-1 text-sm  ${timer > 0 ? `text-gray-300`:`text-blue-600  hover:underline cursor-pointer`}`} disabled={timer > 0} 
                        onClick={()=>{handleResendOtp()}}
                    >
                        <BiRefresh className="text-lg" />
                        Resend OTP
                    </button>

                    <button
                        type='button'   
                        className="flex items-center justify-center gap-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-lg transition-colors duration-200"
                    >
                        <BiCheck className="text-xl" />
                        Submit
                    </button>
                    </div>
                </div>
                {/* otp component  finish */}
            </div>
        </>
    )
}

export default OtpVerification