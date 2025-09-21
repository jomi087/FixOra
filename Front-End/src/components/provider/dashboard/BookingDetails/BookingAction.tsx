// import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "@/shared/enums/Payment";
import { CancelSeal } from "@/utils/constant";


interface BookingActionProps {
  status: BookingStatus
 
  paymentInfo: {
    mop: PaymentMode;
    status: PaymentStatus;
    paidAt: Date;
    transactionId: string
    reason?: string;
  }
}

const BookingAction: React.FC<BookingActionProps> = ({ status }) => {
  return (
    <>
      {/* {status == BookingStatus.CONFIRMED && paymentInfo.status === PaymentStatus.SUCCESS &&
        <div className="flex items-end mt-5 ">
          <Button
            variant="success"
          >
           Confirmed
          </Button>
        </div>
      } */}
      {/* {status == BookingStatus.CANCELLED && paymentInfo.status === PaymentStatus.FAILED &&
        <div className="flex items-end mt-5 ">
          <Button
            variant="destructive"
            className="cursor-pointer hover:bg-red-700 hover:dark:bg-red-700"
          // onClick={RetryPayment}
          >
            Retry Payment
          </Button>
        </div>
      }*/}
      {status == BookingStatus.CANCELLED &&
        <div className="absolute flex items-center pt-4 opacity-40 sm:opacity-55 xl:static sm:left-75 md:left-82 lg:left-110">
          <p>
            <img
              src={CancelSeal}
              alt="BookingCanceled"
              className="w-25 sm:w-25 md:w-30 lg:w-35 rotate-20"
            />
          </p>
        </div>
      }  
    </>
  );
};

export default BookingAction;

/*


*/