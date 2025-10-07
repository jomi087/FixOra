import { PaymentStatus, type PaymentMode } from "@/shared/enums/Payment";
import { BadgeInfo } from "lucide-react";

interface BookingPaymentProps {
  pricing: {
    baseCost: number;
    distanceFee: number;
  };
  paymentInfo: {
    mop?: PaymentMode;
    status: PaymentStatus;
    paidAt?: Date;
    transactionId?: string
    reason?: string;
  }
}

const BookingPayment: React.FC<BookingPaymentProps> = ({ pricing, paymentInfo }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-1 text-lg font-bold mb-2 text-nav-text font-serif">
        <h3 className="underline underline-offset-4">Payment</h3>
        <div className="inline-block group relative">
          <BadgeInfo size={22} />
          <div className="absolute font-medium left-6 top-4 opacity-0 group-hover:opacity-90 bg-transparent transition-opacity duration-300 ease-in-out min-w-[230px] rounded-md border border-gray-300 text-primary p-2 shadow-md z-50">
            <ul>
              {paymentInfo.transactionId && (
                <li className="text-[10px]">{paymentInfo.transactionId}</li>
              )}
              {paymentInfo.mop && (
                <li className="text-[12px]">{paymentInfo.mop}</li>
              )}
              {paymentInfo.status && paymentInfo.status != PaymentStatus.PENDING && (
                <li className="text-[12px]">{paymentInfo.status}</li>
              )}
              {paymentInfo.paidAt && (
                <li className="text-[12px]">{new Date(paymentInfo.paidAt).toLocaleDateString()}</li>
              )}
              {paymentInfo.reason && paymentInfo.status === PaymentStatus.PENDING && (
                <li className="text-[12px]">{paymentInfo.reason}</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm text-body-text">
        <div className="flex justify-between">
          <span className="font-medium">Service Charge:</span>
          <span>{pricing.baseCost}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Distance Fee:</span>
          <span>{pricing.distanceFee}</span>
        </div>

        <hr />

        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>
            {pricing.baseCost + pricing.distanceFee}
          </span>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <p>
          * This will be the upfront payment that the user pays when booking the
          service.
        </p>
        <p>
          * Additional charges (if any) should be collected after diagnosing the
          issue with bill.
        </p>
      </div>
    </div>
  );
};
export default BookingPayment;
