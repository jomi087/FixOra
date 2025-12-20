import { DATE_RANGE_DAYS, Messages, TIME_SLOTS } from "@/utils/constant";
import { dateTime, DayName, generateDateList, generateTimeSlots } from "@/utils/helper/Date&Time";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { addBooking, fetchProviderInfo, removeBooking, updateBookingStatus } from "@/store/user/providerInfoSlice";
import { useEffect, useState } from "react";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { BookingResponsePayload } from "@/shared/typess/booking";
import socket from "@/services/soket";
import { PaymentMode } from "@/shared/enums/Payment";
import { ProviderResponseStatus } from "@/shared/enums/ProviderResponseStatus";
import { loadStripe } from "@stripe/stripe-js";
import { NotificationType } from "@/shared/enums/NotificationType";
import type { AxiosError } from "axios";




export const useBookingRequest = (
  type: "Schedule" | "Reschedule",
  rescheduleBooking?: (scheduledAt: Date) => Promise<void>
) => {

  const dates = generateDateList(DATE_RANGE_DAYS); //365
  let allSlots = generateTimeSlots(
    TIME_SLOTS.STARTHOURS, //0
    TIME_SLOTS.ENDHOURS, //23
    TIME_SLOTS.INTERVAL //60
  );

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

  const { items } = useAppSelector(state => state.notification);
  const { data } = useAppSelector((state) => state.providerInfo);
  const dispatch = useAppDispatch();

  const getAvailableSlotsForDate = (date: string) => {  //selectedDate via genrateDate 01-10-2025
    if (!data?.availability) return [];

    const dayName = DayName(date);

    const daySchedule = data.availability.find(d => d.day === dayName && d.active);
    if (!daySchedule) return [];

    return allSlots.filter((slot) =>
      daySchedule.slots.includes(slot.value) // value = "HH:mm"
    );
  };

  const filteredTimeSlots = getAvailableSlotsForDate(selectedDate);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (type == "Reschedule") {
      if (!rescheduleBooking) return toast.error("Something went wrong");
      const rescheduledAt = dateTime(selectedDate, time);
      rescheduleBooking(rescheduledAt);
    } else {
      setIsDialogOpen(true);
    }
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

    setIsWaiting(true);

    try {
      const res = await AuthService.bookingApplicationApi(payload);
      if (res.status === HttpStatusCode.OK) {
        if (res.data.booking.status == BookingStatus.PENDING) {
          dispatch(addBooking(res.data.booking));
        }
        setIsDialogOpen(false);
        setSelectedTime("");
        setSelectedServiceId("");
        setDescription("");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setIsWaiting(false);
      if (error.status == HttpStatusCode.CONFLICT) {
        dispatch(fetchProviderInfo(data.providerId));
      };
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

        const toastMessage = (
          <div className="w-full">
            <p className="p-2 text-sm font-medium">Your Booking was Rejected</p>
            <p className="text-end text-[12px] ">{`[Reason: ${payload.reason}]`}</p>
          </div>
        );

        toast.success(toastMessage, {
          position: "top-center",
          autoClose: 2500,
          className: "custom-toast",
          closeOnClick: true,
          pauseOnHover: false,
        });
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

  useEffect(() => {
    const latest = items[0];
    if (latest?.type === NotificationType.BOOKING_CANCELLED) {
      dispatch(removeBooking(latest.metadata.bookingId));
    }
  }, [items]);

  
  const stripePromise = type === "Schedule" ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!) : null;
  
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

      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
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

        if (res.status === HttpStatusCode.OK) {
          dispatch(updateBookingStatus(res.data.result));
          toast.success("Booking Successfull");
          setShowModePayment(false);
          setIsWaiting(false);
        }

      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMsg = error?.response?.data?.message || Messages.PAYMENT_FAILED;
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    isWaiting, setIsWaiting,
    showModePayment, setShowModePayment,
    data,
    dates, selectedDate, handleDateChange,
    filteredTimeSlots, selectedTime, handleTimeChange,
    isDialogOpen, setIsDialogOpen,
    selectedServiceId, setSelectedServiceId,
    description, setDescription,
    submitBooking,
    handlePayment, isSubmitting
  };
};

