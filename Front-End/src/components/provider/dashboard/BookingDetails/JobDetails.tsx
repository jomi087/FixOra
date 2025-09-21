
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { Messages } from "@/utils/constant";
import type { JobInfoDetails } from "@/shared/Types/booking";
import AppointmentDetails from "./AppointmentDetails";
import BookingPayment from "./BookingPayment";
// import AppointmentActions from "./AppointmentActions";
import ClientInfo from "./ClientInfo";
import WorkProof from "./WorkProof";
import BookingDetailsShimmer from "./shimmer ui/BookingDetailsShimmer";
import BookingAction from "./BookingAction";


const JobDetails = () => {
  const { bookingId } = useParams();

  const location = useLocation();
  const rawFrom = (location.state as { from?: string })?.from;
  const from = rawFrom === "dashboard" ? "dashboard" : "history";
  
  const [bookingInDetails, setBookingInDetails] = useState<JobInfoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        toast.error("Booking ID is missing");
        return;
      }
      try {
        const res = await AuthService.jobDetailsApi(bookingId);
        setBookingInDetails(res.data.jobDetailsData);

      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMsg =
          err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);


  if (isLoading) {
    return <BookingDetailsShimmer />;
  };

  if (!bookingInDetails) {
    return (
      <p className="text-center py-10 text-red-500">
        No booking details found
      </p>
    );
  }

  return (
    <div className="w-full">
      <nav className="pt-4 sm:px-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center space-x-2">
          <li>
            {from === "dashboard" &&
              <Link to="/provider/dashboard" className="hover:underline">Dashboard</Link>
            }
            {from === "history" &&
              <Link to="/provider/booking-history" className="hover:underline">History</Link>
            }
          </li>
          <li>/</li>
          <li className="text-foreground font-semibold">Booking Details</li>
        </ol>
      </nav>

      <div className="min-h-screen w-full sm:px-2 overflow-auto text-body-text">
        <div className="flex flex-col-reverse md:flex-row ">
          {/* left */}
          <div className="w-full md:w-[60%] lg:w-[70%] p-5">
            <h2 className="text-lg font-bold mb-4 underline underline-offset-4 text-nav-text font-serif">Details</h2>

            <AppointmentDetails
              scheduledAt={bookingInDetails.scheduledAt}
              category={bookingInDetails.category}
              issue={bookingInDetails.issue}
            />

            <div className="mt-2 sm:mt-5 pt-4 flex justify-between flex-wrap border-t-1 border-black">
              <BookingPayment
                pricing={bookingInDetails.pricing}
              // paymentInfo={bookingInDetails.paymentInfo}
              />
              <BookingAction
                status={bookingInDetails.status}
                paymentInfo={bookingInDetails.paymentInfo}
              />
              {bookingInDetails.paymentInfo.reason && (<p className="font-serif text-nav-text text-lg my-5">Reason: <span className="text-primary text-base">{bookingInDetails.paymentInfo.reason}</span></p>)}
              {/* {bookingInDetails.acknowledgment &&
                <AppointmentActions acknowledgment={bookingInDetails.acknowledgment} />
              } */}
            </div>
          </div>
          {/* right */}
          <div className="w-full md:w-[40%] lg:w-[30%] p-5 md:border-l-2">
            <ClientInfo user={bookingInDetails.user} />
          </div>
        </div>

        {bookingInDetails.acknowledgment?.isWorkCompletedByProvider
          && bookingInDetails.acknowledgment.isWorkConfirmedByUser &&
          <WorkProof imageUrls={bookingInDetails.acknowledgment.imageUrl} />
        }
      </div>
    </div>
  );
};

export default JobDetails;