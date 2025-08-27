import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BGImage_404 } from "@/utils/constant";
import PaymentSuccess from '@/assets/animations/CardSwipeSuccess.json'
import Lottie from "lottie-react";


const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  

  return (
    <div
      style={{ backgroundImage: BGImage_404  }}
      className="flex items-center justify-center min-h-screen bg-cover">
      <div className="bg-white/50 rounded-4xl shadow-2xl shadow-black p-6 sm:p-10 max-w-md w-full text-center overflow-auto">
        <div className="flex justify-center">
          <Lottie animationData={PaymentSuccess} loop={false} className="w-40 sm:w-52 md:w-60"/>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Thank you! Your payment has been processed successfully.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/user/bookings")}
            variant="success"
            className="w-full rounded-xl py-3 text-lg shadow-2xl shadow-black border"
          >
            Booking Details
          </Button>
          <Button
            onClick={() => navigate("/user/providers")}
            variant="outline"
            className="w-full rounded-xl py-3 text-lg  shadow-2xl shadow-black "
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
