import { useEffect, useState } from "react";
import { BiCheck, BiRefresh } from "react-icons/bi";
import { toast } from "react-toastify";

interface otpProps {
  otpTime: number;
  otpLength: number;
  otpSubmit: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
}

const Otp: React.FC<otpProps> = ({ otpTime, otpLength, otpSubmit, resendOtp }) => {
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const [timer, setTimer] = useState(otpTime);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < otpLength - 1) {
      const nextInput = document.getElementsByClassName("otp_input")[idx + 1] as HTMLInputElement | undefined;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {

    if (e.key === "Backspace") {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        const nextInput = document.getElementsByClassName("otp_input")[idx - 1] as HTMLInputElement | undefined;
        nextInput?.focus();
      }
    }
  };

  const handleResendOtp = () => {
    setTimer(otpTime);

    setOtp(new Array(otpLength).fill(""));
    const nextInput = document.getElementsByClassName("otp_input")[0] as HTMLInputElement | undefined;
    nextInput?.focus();

    resendOtp();
  };

  const handleOtpSubmit = () => {
    const otpString = otp.join("");
    if (otpString.length !== otpLength) {
      toast.warning("Please enter a complete OTP.");
      return;
    }
    otpSubmit(otpString);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* otp component  start*/}
      <div className="bg-white rounded-xl shadow-2xl shadow-gray-700 w-full max-w-md p-6">
        <h2 id="otp-heading" className="text-2xl font-bold text-center mb-2">OTP Verification</h2>
        <p className="text-gray-600 text-center mb-4">
          Please enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-center gap-4 mb-4 flex-wrap" role="group" aria-labelledby="otp-heading">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              className="otp_input w-10 h-12 border text-black border-gray-300 rounded-md text-center text-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={value}
              aria-label={`Digit ${index + 1} of 6 for OTP`}

              autoFocus={index == 0} // next time i have do this in another way
              maxLength={1} //to avoid multiple numbers
              inputMode='numeric' //to show a numeric keypad for mobile user
              onChange={(e) => { handleOtpChange(e, index); }} //react event  handlers only pass one argument  then is event /e
              onKeyDown={(e) => { handleKeyDown(e, index); }}
            />
          ))}
        </div>

        {/* <div className="text-center text-gray-500 mb-4">
                    Time remaining: <span className="font-semibold">{timer}</span> seconds
                </div> */}

        <div className="flex justify-between items-center gap-4">
          {timer <= 0 ? (
            <button
              type='button'
              className={"flex items-center gap-1 text-sm text-blue-600  hover:underline cursor-pointer"}
              onClick={() => { handleResendOtp(); }}
            >
              <BiRefresh className="text-lg" />
              Resend OTP
            </button>
          ) : (
            <p className="font-roboto font-medium underline underline-offset-4 ">
              {formatTime(timer)}
            </p>
          )}

          <button
            type='button'
            disabled={!isOtpComplete}
            className={`flex items-center justify-center gap-1  text-white font-bold px-5 py-2 rounded-lg transition-colors duration-200 ${!isOtpComplete ? "bg-gray-300" : "bg-blue-700 hover:bg-blue-800"}`}
            onClick={(handleOtpSubmit)}
          >
            <BiCheck className="text-xl" />
            Submit
          </button>
        </div>
      </div>
      {/* otp component  finish */}
    </>
  );
};

export default Otp;

