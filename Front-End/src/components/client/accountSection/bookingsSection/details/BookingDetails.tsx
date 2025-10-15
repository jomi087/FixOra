import BookingDetailsShimmer from "@/components/provider/dashboard/BookingDetails/shimmer ui/BookingDetailsShimmer";
import AuthService from "@/services/AuthService";
import type { BookingInfoDetails } from "@/shared/types/booking";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppointmentDetails from "./AppointmentDetails";
import BookingPayment from "./BookingPayment";
import ProviderInfo from "./ProviderInfo";
import WorkProof from "./WorkProof";
import BookingAction from "./BookingAction";
import { PaymentMode, PaymentStatus } from "@/shared/enums/Payment";
import { ModeOfPayment } from "@/components/common/Others/ModeOfPayment";
import { loadStripe } from "@stripe/stripe-js";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import { NotificationType } from "@/shared/enums/NotificationType";
import { useAppSelector } from "@/store/hooks";
import Diagnosed from "@/components/common/Others/Diagnosed";
import FeedbackDialog from "./dialoge/FeedbackDialog";
import CancelDialoge from "./dialoge/CancelDialoge";
import { InvoicePDF } from "./invoice/InvoicePDF";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";


const BookingDetails = () => {
  const { bookingId } = useParams();

  const [bookingInDetails, setBookingInDetails] = useState<BookingInfoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModePayment, setShowModePayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, error } = useAppSelector(state => state.notification);
  const [openFeedBack, setOpenFeedBack] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean | null>(null);
  //fetch Booking
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

  // review raiting 
  useEffect(() => {
    if (!bookingInDetails || bookingInDetails.status !== BookingStatus.COMPLETED) return;
    const fetchReviewStatus = async () => {
      try {
        const res = await AuthService.getReviewStatus(bookingInDetails.bookingId);
        setHasUserReviewed(res.data.reviewStatus);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMsg =
          err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        toast.error(errorMsg);
      }
    };
    fetchReviewStatus();
  }, [bookingInDetails]);

  //cancel Booking
  const cancelBooking = async () => {
    if (!bookingId || !bookingInDetails) {
      toast.error("Something went wrong");
      return;
    }

    try {
      const res = await AuthService.cancelBookingApi(bookingId);

      const bookingStatus = res.data.bookingStatus;
      const paymentInfo = res.data.refundInfo;

      const refundType = paymentInfo.status === PaymentStatus.REFUNDED ? "Full" : "Partial";

      const toastMessage = (
        <div className="w-full">
          <h4 className="text-center">Booking Cancelled</h4>
          <p className="text-center p-2">{`${refundType} amount has been refunded to your wallet`}</p>
        </div>
      );

      toast.success(toastMessage, {
        position: "top-center",
        autoClose: 2500,
        className: "center-box-toast ",
        closeOnClick: true,
        pauseOnHover: false,
      });

      setBookingInDetails((prev) => prev ? {
        ...prev,
        status: bookingStatus,
        paymentInfo: {
          ...prev.paymentInfo,
          status: paymentInfo.status,
          reason: paymentInfo.reason,
        }
      } : prev);

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    } finally {
      setConfirmOpen(false);
    }
  };

  // validate retry payment
  const retryPayment = async () => {
    if (!bookingId || !bookingInDetails) {
      toast.error("Something went wrong");
      return;
    }

    //check slot is still avialable or not
    try {
      await AuthService.retryAvailabilityApi(bookingId);
      setShowModePayment(true);
    } catch (err) {
      let errorMsg = Messages.FAILED_TO_FETCH_DATA;

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === HttpStatusCode.CONFLICT || status === HttpStatusCode.GONE) {
          const booking = err.response?.data?.booking;

          if (booking) {
            setBookingInDetails((prev) =>
              prev
                ? {
                  ...prev,
                  status: booking.status,
                  paymentInfo: {
                    ...prev.paymentInfo,
                    status: booking.paymentInfo.status,
                    reason: booking.paymentInfo.reason,
                  },
                }
                : prev
            );
            errorMsg = booking.paymentInfo?.reason || "Slot is unavailable";
          } else {
            errorMsg = "Slot is unavailable";
          }
        } else {
          errorMsg = err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
        }
      } else if (err instanceof Error) {
        errorMsg = err.message || Messages.FAILED_TO_FETCH_DATA;
      }
      toast.error(errorMsg);
    }
  };

  //payment
  const handlePayment = async (paymentType: PaymentMode, balance?: number) => {
    if (!bookingInDetails) {
      toast.error("booking id missing");
      return;
    }

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
    setIsSubmitting(true);

    if (paymentType === PaymentMode.ONLINE) {
      try {
        const res = await AuthService.onlinePaymentApi(bookingInDetails.bookingId);
        const sessionId = res.data;

        const stripe = await stripePromise;

        if (!stripe) throw new Error(Messages.STRIPE_FAILED);
        await stripe.redirectToCheckout({ sessionId: sessionId });

        setShowModePayment(false);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.log(error);
        const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    } else if (paymentType === PaymentMode.WALLET) {
      try {
        if (balance && bookingInDetails.pricing.distanceFee && bookingInDetails.pricing.baseCost) {
          const serviceCharge = bookingInDetails.pricing.distanceFee + bookingInDetails.pricing.baseCost;
          if (balance < serviceCharge) {
            toast.info("Low Balance");
            return;
          }
        }
        const res = await AuthService.walletPaymentApi(bookingInDetails.bookingId);
        const status = res.data.result.status;
        const paymentInfo = res.data.result.paymentInfo;

        setBookingInDetails((prev) =>
          prev
            ? {
              ...prev,
              status: status,
              paymentInfo: {
                mop: paymentInfo.mop,
                status: paymentInfo.status,
                paidAt: paymentInfo.paidAt,
                transactionId: paymentInfo.transactionId,
              },
            }
            : prev
        );

        toast.success("Booking Successfull");
        setShowModePayment(false);

      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  //notify work completion
  useEffect(() => {
    const latest = items[0];
    if (latest?.type === NotificationType.BOOKING_COMPLETED) {
      setBookingInDetails((prev) => prev ? {
        ...prev,
        status: latest.metadata.status,
        workProof: latest.metadata.workProof
      } : prev);
    }
  }, [items]);

  const handleDownloadPDF = async () => {
    // Create a Blob from the document

    const blob = await pdf(<InvoicePDF invoiceData={bookingInDetails!} />).toBlob();
    const url = URL.createObjectURL(blob);
    //console.log(url)

    // Trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.download = `INV-${new Date().toLocaleString()}.pdf`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  //handleFeedback

  const handleFeedBack = async (data: { rating: number, feedback: string }) => {
    try {
      if (!bookingInDetails) return;
      const payload = {
        bookingId: bookingInDetails.bookingId,
        ...data,
      };
      await AuthService.updateFeedbackApi(payload);
      toast.success("Thank you for your valuable feedback");
      setHasUserReviewed(true);
      setOpenFeedBack(false);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
      toast.error(errorMsg);
    }
  };

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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {showModePayment &&
        <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-xl overflow-auto shadow-black shadow-2xl bg-background ">
            <div className="flex justify-between ">
              <div className="text-xl font-bold font-mono underline underline-offset-4 pt-5 pb-2 pl-5">Mode of Payment</div>
              <div
                className="font-bold text-lg pr-3 cursor-pointer text-primary"
                onClick={() => { setShowModePayment(false); }}
              >
                x
              </div>
            </div>
            < ModeOfPayment handlePayment={handlePayment} isSubmitting={isSubmitting} />
          </div>
        </div>
      }
      <div className="min-h-screen w-full sm:px-2 overflow-auto text-body-text ">
        <div className="flex flex-col-reverse md:flex-row">
          {/* left */}
          <div className="w-full md:w-[60%] lg:w-[70%] p-5 pb-0">
            <h2 className="text-lg font-bold mb-4 underline underline-offset-4 text-nav-text font-serif">Details</h2>

            <AppointmentDetails
              scheduledAt={bookingInDetails.scheduledAt}
              category={bookingInDetails.category}
              issue={bookingInDetails.issue}
            />

            <div className="mt-2 sm:mt-5 pt-4 px-1 flex justify-between flex-wrap border-t-1 border-black">
              <BookingPayment
                pricing={bookingInDetails.pricing}
                paymentInfo={bookingInDetails.paymentInfo}
              />

              <BookingAction
                status={bookingInDetails.status}
                retryPayment={retryPayment}
                paymentInfo={bookingInDetails.paymentInfo}
                setOpenFeedBack={setOpenFeedBack}
                setConfirmOpen={setConfirmOpen}
                hasUserReviewed={hasUserReviewed}
                handleDownloadPDF={handleDownloadPDF}
              />
            </div>

            {bookingInDetails.paymentInfo.reason && (<p className="font-serif text-nav-text text-lg my-5">Reason: <span className="text-primary text-base">{bookingInDetails.paymentInfo.reason}</span></p>)}

            {bookingInDetails.status == BookingStatus.COMPLETED && bookingInDetails.workProof &&
              <div className="overflow-auto w-[100%] ">
                <WorkProof imageUrls={bookingInDetails.workProof} />
              </div>
            }

            {confirmOpen &&
              <CancelDialoge
                setConfirmOpen={setConfirmOpen}
                handleConfirmation={cancelBooking}
              />
            }

            {openFeedBack &&
              <FeedbackDialog
                openFeedBack={openFeedBack}
                setOpenFeedBack={setOpenFeedBack}
                handleFeedBack={handleFeedBack}
              />
            }

          </div>
          {/* right */}
          <div className="w-full md:w-[40%] lg:w-[30%] p-5 md:border-l-2">
            <ProviderInfo providerUser={bookingInDetails.providerUser} />

            {/* Diagnosed */}
            {bookingInDetails.status == BookingStatus.COMPLETED && bookingInDetails.diagnosed &&
              <Diagnosed
                diagnose={bookingInDetails.diagnosed}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingDetails;