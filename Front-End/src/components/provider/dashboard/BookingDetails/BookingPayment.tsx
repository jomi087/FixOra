interface BookingPaymentProps {
  pricing: {
    baseCost: number;
    distanceFee: number;
  };
  commission: number
}


const BookingPayment: React.FC<BookingPaymentProps> = ({ pricing, commission }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-1 text-lg font-bold mb-2 text-nav-text underline underline-offset-4 font-serif">
        <h3>Payment</h3>
      </div>

      <div className="space-y-2 text-sm text-body-text">
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
          * Additional charges (if ny) should be collected after diagnosing the
          issue with bill.
        </p>
        <p>
          * A service commission of ₹{commission} will be deducted from the total amount and will reflect in your wallet.
          This policy also applies to partial refunds.
        </p>
      </div>
    </div>
  );
};
export default BookingPayment;