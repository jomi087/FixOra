import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BGImage_404 } from "@/utils/constant";
import PaymentFailed from "@/assets/animations/crossFailed.json";
import Lottie from "lottie-react";


const PaymentFailurePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{ backgroundImage: BGImage_404 }}
      className="flex items-center justify-center min-h-screen bg-cover px-4"
    >
      <div className="bg-white rounded-4xl shadow-2xl shadow-black p-6 sm:p-10 max-w-md w-full text-center overflow-auto">
        <div className="flex justify-center">
          <Lottie animationData={PaymentFailed} loop className="w-40 sm:w-52 md:w-60" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Oops! Something went wrong while processing your payment.  
          Please try again or use a different payment method.
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
            onClick={() => navigate("/user/providers")}
            variant="outline"
            className="w-full rounded-xl py-3 text-base sm:text-lg shadow-2xl shadow-black"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;