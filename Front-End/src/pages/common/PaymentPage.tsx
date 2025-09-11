import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { BGImage_404 } from "@/utils/constant";
import Lottie from "lottie-react";
import PaymentFailed from "@/assets/animations/crossFailed.json";
import PaymentSuccess from "@/assets/animations/CardSwipeSuccess.json";
import loading from "@/assets/animations/loadingWrist.json";

import { useEffect, useState } from "react";
import socket from "@/services/soket";

type PaymentState = "loading" | "success" | "failure";

const PaymentPage = () => {
  const { bookingId } = useParams();

  const navigate = useNavigate();
  //const dispatch = useAppDispatch();
  const [paymentState, setPaymentState] = useState<PaymentState>("loading");
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      setPaymentState("success");
    };

    const handlePaymentFailed = (reason: string) => {
      setFailureReason(reason);
      setPaymentState("failure");
    };

    socket.on("payment:success", handlePaymentSuccess);
    socket.on("payment:failure", handlePaymentFailed);

    return () => {
      socket.off("payment:success", handlePaymentSuccess);
      socket.off("payment:failure", handlePaymentFailed);
    };
  }, []);



  return (
    <div
      style={{ backgroundImage: BGImage_404 }}
      className="flex items-center justify-center w-full min-h-screen bg-cover bg-center p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl shadow-black p-6 sm:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg text-center overflow-auto">
        {paymentState === "loading" && (
          <div className="flex justify-center">
            <Lottie animationData={loading} loop className="w-42 sm:w-82 md:w-140" />
          </div>
        )}
        {paymentState === "success" && (
          <>
            <div className="flex justify-center">
              <Lottie
                animationData={PaymentSuccess}
                loop={false}
                className="w-40 sm:w-52 md:w-60"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Payment Successfull
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Thank you! Your payment has been processed successfully.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  if (!bookingId) {
                    navigate("/user/account/bookings");
                  } else {
                    navigate(`/user/account/bookings/details/${bookingId}`);
                  }
                }}
                variant="success"
                className="w-full rounded-xl py-3 text-lg shadow-2xl shadow-black border"
              >
                Booking Details
              </Button>
              <Button
                onClick={() => navigate("/user/providers")}
                variant="outline"
                className="w-full rounded-xl py-3 text-lg shadow-2xl shadow-black"
              >
                Go Back
              </Button>
            </div>
          </>
        )}

        {paymentState === "failure" && (
          <>
            <div className="flex justify-center">
              <Lottie
                animationData={PaymentFailed}
                loop
                className="w-40 sm:w-52 md:w-60"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {failureReason ? `Reason: ${failureReason}` : "Something went wrong while processing your payment."}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/tryagain")}
                variant="destructive"
                className="w-full hover:bg-red-500 rounded-xl py-3 text-base sm:text-lg shadow-2xl shadow-black"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full rounded-xl py-3 text-base sm:text-lg shadow-2xl shadow-black"
              >
                Go Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
