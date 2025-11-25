import BookingDatesInfo from "@/components/common/others/BookingDatesInfo";
import TimeSlotSelector from "@/components/client/providersSection/providerInfo/TimeSlotSelector";
import BookingDialog from "./BookingDialog";

import Lottie from "lottie-react";
import LodingAnimation from "@/assets/animations/BoxyLoading.json";
import { useBookingRequest } from "@/hooks/useBookingRequest";
import { ModeOfPayment } from "@/components/common/others/ModeOfPayment";
import { useEffect, useRef, useState } from "react";
import { PAYMENT_SESSION_TIMEOUT_MS } from "@/utils/constant";

const durationMs = PAYMENT_SESSION_TIMEOUT_MS;

const BookingSlots: React.FC = () => {

  const {
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
  } = useBookingRequest();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [remaining, setRemaining] = useState(durationMs);

  useEffect(() => {
    if (!isWaiting || !showModePayment) return;

    setRemaining(durationMs);
    const endTime = Date.now() + durationMs;
    timerRef.current = setInterval(() => {
      const left = endTime - Date.now();
      setRemaining(left > 0 ? left : 0);
      if (left <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWaiting, showModePayment]);

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <>
      {isWaiting && !showModePayment && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center">
          <Lottie animationData={LodingAnimation} loop={true} className="w-40 h-40" />
          <p className=" m-4 text-primary text-lg font-mono">Waiting for provider response...</p>
        </div>
      )}

      {isWaiting && showModePayment && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-xl overflow-auto shadow-black shadow-2xl bg-background p-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold font-mono underline underline-offset-4 py-4 pl-5">
                Mode of Payment
              </h2>
              <p
                className="font-bold text-lg pr-3 cursor-pointer text-primary"
                onClick={() => {
                  setShowModePayment(false);
                  setIsWaiting(false);
                }}
              >
                x
              </p>
            </div>
            < ModeOfPayment handlePayment={handlePayment} isSubmitting={isSubmitting} timmer={{ minutes, seconds } } />
          </div>
        </div>
      )}

      {data ? (
        <div className="shadow-lg shadow-ring border-2 mt-10 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
          <BookingDatesInfo
            dates={dates}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          <TimeSlotSelector
            timeSlots={filteredTimeSlots}
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            selectedDate={selectedDate}
            bookedSlots={data.bookings}
          />

          <BookingDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            description={description}
            setDescription={setDescription}
            submitBooking={submitBooking}
          />
        </div>
      ) : (
        <div className="flex justify-center h-[78vh] items-center text-sm text-muted-foreground ">
          No Data found.
        </div>
      )}
    </>
  );
};

export default BookingSlots;

