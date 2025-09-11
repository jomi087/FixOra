import { DATE_RANGE_DAYS, Messages, TIME_SLOTS } from "@/utils/constant";
import { dateTime, generateDateList, generateTimeSlots } from "@/utils/helper/date&Time";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { addBooking, removeBooking, updateBookingStatus } from "@/store/user/providerInfoSlice";
import { useEffect, useState } from "react";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { BookingResponsePayload } from "@/shared/Types/booking";
import socket from "@/services/soket";
import { PaymentMode } from "@/shared/enums/Payment";
import { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";
import { loadStripe } from "@stripe/stripe-js";


export const useBookingRequest = () => {
  const dates = generateDateList(DATE_RANGE_DAYS);
  const timeSlots = generateTimeSlots(
    TIME_SLOTS.STARTHOURS,
    TIME_SLOTS.ENDHOURS,
    TIME_SLOTS.INTERVAL
  ); // Default: 9AM–6PM, every 30 min

  const FirstDate = dates[0]?.fullDate || "";

  const [selectedDate, setSelectedDate] = useState(FirstDate);
  const [selectedTime, setSelectedTime] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [description, setDescription] = useState("");

  const [isWaiting, setIsWaiting] = useState(false);
  const [showModePayment, setShowModePayment] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data } = useAppSelector((state) => state.providerInfo);
  const dispatch = useAppDispatch();

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setIsDialogOpen(true);
  };

  const submitBooking = async () => {
    if (!data?.providerId) {
      toast.error("provider data missing");
      return;
    }

    const payload = {
      providerId: data.providerId,
      providerUserId: data.user.userId,
      scheduledAt: dateTime(selectedDate, selectedTime),
      issueTypeId: selectedServiceId,
      issue: description
    };

    //console.log("payload",payload)
    setIsWaiting(true);

    try {
      const res = await AuthService.BookingApplicationApi(payload);
      //console.log(res);
      if (res.status === HttpStatusCode.OK) {
        if (res.data.booking.status == BookingStatus.PENDING) {
          dispatch(addBooking(res.data.booking));
        }
        setIsDialogOpen(false);
        setSelectedTime("");
        setSelectedServiceId("");
        setDescription("");
      }
    } catch (error: any) {
      setIsWaiting(false);
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS;
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    const handleBookingResponse = (payload: BookingResponsePayload) => {
      if (payload.response === ProviderResponseStatus.ACCEPTED) {
        setBookingId(payload.bookingId);
        setShowModePayment(true);

      } else if (payload.response === ProviderResponseStatus.REJECTED) {
        setIsWaiting(false);

        dispatch(removeBooking(payload.bookingId));
        toast.warn("Your Booking was Rejected");
        toast.info(`Reason: ${payload.reason}`);
      }
    };

    const handleAutoRejectPayment = (bookingId: string) => {
      dispatch(removeBooking(bookingId));
      setShowModePayment(false);
      setIsWaiting(false);
    };

    socket.on("booking:response", handleBookingResponse);
    socket.on("payment:autoReject", handleAutoRejectPayment);
    return () => {
      socket.off("booking:response", handleBookingResponse);
      socket.off("payment:autoReject", handleAutoRejectPayment);
    };

  }, [dispatch]);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  const handlePayment = async (paymentType: PaymentMode, balance?: number) => {
    setIsSubmitting(true);

    if (paymentType === PaymentMode.ONLINE) {
      try {
        const res = await AuthService.onlinePaymentApi(bookingId);
        const sessionId = res.data;

        const stripe = await stripePromise;

        if (!stripe) throw new Error(Messages.STRIPE_FAILED);
        await stripe.redirectToCheckout({ sessionId: sessionId });

        setShowModePayment(false);
        setIsWaiting(false);

      } catch (error: any) {
        console.log(error);
        const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }

    } else if (paymentType === PaymentMode.WALLET) {
      try {
        if (balance && data?.distanceFee && data.serviceCharge) {
          if (balance < (data.distanceFee + data.serviceCharge)) {
            toast.info("Low Balance");
            return;
          }
        }
        const res = await AuthService.walletPaymentApi(bookingId);
        console.log(res);
        dispatch(updateBookingStatus(res.data.result));
        toast.success("Booking Successfull");

        setShowModePayment(false);
        setIsWaiting(false);

      } catch (error: any) {
        console.log(error);
        const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    isWaiting, showModePayment,
    data,
    dates, selectedDate, handleDateChange,
    timeSlots, selectedTime, handleTimeChange,
    isDialogOpen, setIsDialogOpen,
    selectedServiceId, setSelectedServiceId,
    description, setDescription,
    submitBooking,
    handlePayment, isSubmitting
  };
};

