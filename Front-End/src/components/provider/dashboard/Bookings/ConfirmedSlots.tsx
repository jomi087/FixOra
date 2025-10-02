import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { ConfirmJobBookings } from "@/shared/Types/booking";
import { splitDateTime } from "@/utils/helper/date&Time";

interface ConfirmedSlotsProps {
  selectedDate: Date ;
  setSelectedDate: (selectedDate: Date ) => void;
  selectedSlot: string | null;
  setSelectedSlot: (selectedSlot: string | null) => void;
  data: ConfirmJobBookings[];
  handleBookingDetails: (booking: ConfirmJobBookings) => void
}


const ConfirmedSlots: React.FC<ConfirmedSlotsProps> = ({ selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, data, handleBookingDetails }) => {

  // Format selectedDate -> "dd-mm-yyyy"
  const formattedSelectedDate = selectedDate ? splitDateTime(selectedDate).date : setSelectedDate(new Date());;

  // Filter bookings for selected date
  const bookingsForDate: ConfirmJobBookings[] = formattedSelectedDate
    ? data.filter((b: ConfirmJobBookings) => {
      const { date } = splitDateTime(b.scheduledAt);
      return date === formattedSelectedDate;
    })
    : [];

  return (
    <div className="flex-1 p-2 flex">
      {bookingsForDate.length === 0 ? (
        <div className="flex flex-1 h-full justify-center items-center">
          <p className="text-gray-500 italic">No bookings for this date</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-2">
          {bookingsForDate.map((booking) => {
            const { time } = splitDateTime(booking.scheduledAt);

            let slotClass =
              "p-4 h-14 w-full border rounded-lg hover:scale-105 flex items-center justify-center transition ";

            if (
              booking.acknowledgment.isWorkCompletedByProvider &&
              booking.acknowledgment.isWorkConfirmedByUser
            ) {
              slotClass += " text-green-500 font-semibold cursor-pointer";
            } else if (booking.status === BookingStatus.CONFIRMED) {
              slotClass += " text-cyan-500 font-semibold cursor-pointer";
            }

            return (
              <button
                key={booking.bookingId}
                onClick={() => {
                  setSelectedSlot(`${formattedSelectedDate}_${time}`);
                  if (booking) { handleBookingDetails(booking); }
                }}
                className={`${slotClass} ${selectedSlot === `${formattedSelectedDate}_${time}`
                  ? " ring-2 ring-primary shadow-md "
                  : ""
                }`}
              >
                {time} —{" "}
                {booking.acknowledgment.isWorkCompletedByProvider &&
                  booking.acknowledgment.isWorkConfirmedByUser
                  ? "Finished ✔️"
                  : booking.status === BookingStatus.CONFIRMED
                    ? "Booked 🔖"
                    : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConfirmedSlots;