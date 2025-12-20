import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { ConfirmJobBookings } from "@/shared/typess/booking";
import { splitDateTime } from "@/utils/helper/Date&Time";

interface ConfirmedSlotsProps {
  selectedDate: Date;
  selectedSlot: string | null;
  setSelectedSlot: (selectedSlot: string | null) => void;
  data: ConfirmJobBookings[];
  handleBookingDetails: (booking: ConfirmJobBookings) => void
}


const ConfirmedSlots: React.FC<ConfirmedSlotsProps> = ({ selectedDate, selectedSlot, setSelectedSlot, data, handleBookingDetails }) => {

  // Format selectedDate -> "dd-mm-yyyy"
  const formattedSelectedDate = splitDateTime(selectedDate).date;

  // Filter bookings for selected date
  const bookingsForDate: ConfirmJobBookings[] = formattedSelectedDate
    ? data.filter((b: ConfirmJobBookings) => {
      const { date } = splitDateTime(b.scheduledAt);
      return date === formattedSelectedDate;
    })
    : [];

  return (
    <div className="md:w-2/3">
      {bookingsForDate.length === 0 ? (
        <div className="flex flex-1 h-full justify-center items-center">
          <p className="text-gray-500 italic">No bookings for this date</p>
        </div>
      ) : (
        <div
          className="p-2 grid grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min content-start mt-10 "
        >
          {bookingsForDate.map((booking) => {
            const { time } = splitDateTime(booking.scheduledAt);

            let slotClass =
              "text-sm p-3 lg:p-4 border rounded-lg hover:scale-105 flex items-center justify-center transition ";

            if (booking.status === BookingStatus.COMPLETED) {
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
                {booking.status === BookingStatus.COMPLETED
                  ? `${time}✔️`
                  : booking.status === BookingStatus.CONFIRMED
                    ? `${time}🔖`
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