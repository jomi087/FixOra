import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { ConfirmJobBookings } from "@/shared/Types/booking";
import { TIME_SLOTS } from "@/utils/constant";
import { dateTime, generateTimeSlots, splitDateTime } from "@/utils/helper/date&Time";

interface SlotsProps {
	selectedDate: Date | undefined;
	setSelectedDate: (selectedDate: Date | undefined) => void;
	selectedSlot: string | null;
	setSelectedSlot: (selectedSlot: string | null) => void;
	data: ConfirmJobBookings[];
	handleBookingDetails : (booking:ConfirmJobBookings)=>void
}


const Slots: React.FC<SlotsProps> = ({ selectedDate, setSelectedDate, selectedSlot, setSelectedSlot,data,handleBookingDetails }) => {
  const formattedSelectedDate = selectedDate ? splitDateTime(selectedDate).date : setSelectedDate(new Date());;
  const timeSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL);
  return (
    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 py-2">
      {timeSlots.map((slot) => {
        if (!formattedSelectedDate) return null;

        const booking = data.find((b) => {
          const { date, time } = splitDateTime(b.scheduledAt);
          return (
            date === formattedSelectedDate &&
						time === slot.value &&
						b.status === BookingStatus.CONFIRMED
          );
        });

        const bookingDateTime = dateTime(formattedSelectedDate, slot.value);
        const isTimePassed = bookingDateTime.getTime() <= Date.now();

        let slotClass =
					"h-14 w-full border rounded-lg flex items-center justify-center transition hover:border-1 hover:border-primary ";

        if (
          booking?.acknowledgment.isWorkCompletedByProvider &&
					booking?.acknowledgment.isWorkConfirmedByUser
        ) {
          slotClass += " text-green-500 font-semibold cursor-pointer";
        } else if (booking?.status === BookingStatus.CONFIRMED) {
          slotClass += " text-cyan-500 font-semibold cursor-pointer";
        } else if (isTimePassed) {
          slotClass += " opacity-50 cursor-not-allowed text-gray-400";
        } else {
          slotClass += " text-primary cursor-pointer";
        }

        return (
          <button
            key={slot.value}
            disabled={isTimePassed}
            onClick={() => {
              setSelectedSlot(`${formattedSelectedDate}_${slot.value}`);
              if (booking) handleBookingDetails(booking);
            }}
            title={
              booking
                ? booking.status === BookingStatus.CONFIRMED
                  ? "Booked"
                  : ""
                : isTimePassed
                  ? "Un-Available"
                  : "Slot Empty"
            }
            className={`${slotClass} ${selectedSlot === `${formattedSelectedDate}_${slot.value}`
              ? " ring-2 ring-primary shadow-md "
              : ""
            }`}
          >
            {booking?.acknowledgment.isWorkCompletedByProvider &&
							booking?.acknowledgment.isWorkConfirmedByUser
              ? "Finished ✔️"
              : booking?.status === BookingStatus.CONFIRMED
                ? "Booked 🔖"
                : isTimePassed
                  ? slot.timeShort
                  : slot.time}
          </button>
        );
      })}
    </div>
  );
};

export default Slots;