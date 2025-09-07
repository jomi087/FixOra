import BookingDetailsShimmer from "@/components/provider/dashboard/BookingDetails/shimmer ui/BookingDetailsShimmer";
import AuthService from "@/services/AuthService";
import type { BookingInfoDetails } from "@/shared/Types/booking";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppointmentDetails from "./AppointmentDetails";
import BookingPayment from "./BookingPayment";
import AppointmentActions from "./AppointmentActions";
import ProviderInfo from "./ProviderInfo";
import WorkProof from "./WorkProof";

const BookingDetails = () => {
  const { bookingId } = useParams();

  const [bookingInDetails, setBookingInDetails] = useState<BookingInfoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        toast.error("Booking ID is missing");
        return;
      }
      try {
        const res = await AuthService.bookingDetailsApi(bookingId);
        setBookingInDetails(res.data.bookingDetailsData);

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
    <>
      <div className="min-h-screen w-full sm:px-2 overflow-auto text-body-text ">
        <div className="flex flex-col-reverse md:flex-row">
          {/* left */}
          <div className="w-full md:w-[60%] lg:w-[70%] p-5">
            <h2 className="text-lg font-bold mb-4 underline underline-offset-4 text-nav-text font-serif">Details</h2>

            <AppointmentDetails
              scheduledAt={bookingInDetails.scheduledAt}
              category={bookingInDetails.category}
              issue={bookingInDetails.issue}
            />

            <div className="mt-2 sm:mt-5 pt-4 flex justify-between flex-wrap border-t-1 border-black">
              <BookingPayment pricing={bookingInDetails.pricing} />
              {bookingInDetails.acknowledgment &&
								<AppointmentActions acknowledgment={bookingInDetails.acknowledgment} />
              }
            </div>
          </div>
          {/* right */}
          <div className="w-full md:w-[40%] lg:w-[30%] p-5 md:border-l-2">
            <ProviderInfo providerUser={bookingInDetails.providerUser} />
          </div>
        </div>

        {bookingInDetails.acknowledgment?.isWorkCompletedByProvider
					&& bookingInDetails.acknowledgment.isWorkConfirmedByUser &&
					<WorkProof imageUrls={bookingInDetails.acknowledgment.imageUrl} />
        }


      </div>
    </>
  );
};

export default BookingDetails;