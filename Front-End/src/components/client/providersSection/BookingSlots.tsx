import BookingDatesInfo from "@/components/common/Others/BookingDatesInfo";
import TimeSlotSelector from "@/components/common/Others/TimeSlotSelector";
import BookingDialog from "./BookingDialog";

import Lottie from "lottie-react";
import LodingAnimation from "@/assets/animations/BoxyLoading.json";
import { useBookingRequest } from "@/hooks/useBookingRequest";
import { ModeOfPayment } from "@/components/common/Others/ModeOfPayment";


const BookingSlots: React.FC = () => {

  const {
    isWaiting, showModePayment,
    data,
    dates, selectedDate, handleDateChange,
    filteredTimeSlots, selectedTime, handleTimeChange,
    isDialogOpen, setIsDialogOpen,
    selectedServiceId, setSelectedServiceId,
    description, setDescription,
    submitBooking,
    handlePayment, isSubmitting
  } = useBookingRequest();

  return (
    <>
      {isWaiting &&
        <div className="fixed inset-0 bg-black/60 z-[9999] flex flex-col items-center justify-center">
          {showModePayment ? (
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-xl overflow-auto shadow-black shadow-2xl bg-background p-5">
              <div className="text-xl font-bold font-mono underline underline-offset-4 pt-5 pl-5">Mode of Payment</div>
              < ModeOfPayment handlePayment={handlePayment} isSubmitting={isSubmitting} />
            </div>
          ) : (
            <>
              <Lottie animationData={LodingAnimation} loop={true} className="w-40 h-40" />
              <p className=" m-4 text-primary text-lg font-mono">Waiting for provider response...</p>
            </>
          )}
        </div>
      }
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

