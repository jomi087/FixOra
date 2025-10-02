import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { ConfirmJobBookings } from "@/shared/Types/booking";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAvailability } from "@/store/provider/availabilitySlice";
import { TIME_SLOTS } from "@/utils/constant";
import { dateTime, DayName, generateTimeSlots, splitDateTime } from "@/utils/helper/date&Time";
import { useEffect } from "react";

interface SlotsProps {
  selectedDate: Date;
  selectedSlot: string | null;
  setSelectedSlot: (selectedSlot: string | null) => void;
  data: ConfirmJobBookings[];
  handleBookingDetails: (booking: ConfirmJobBookings) => void
}

//  const timeSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL);
const allSlots = generateTimeSlots(TIME_SLOTS.STARTHOURS, TIME_SLOTS.ENDHOURS, TIME_SLOTS.INTERVAL);

const Slots: React.FC<SlotsProps> = ({ selectedDate, selectedSlot, setSelectedSlot, data, handleBookingDetails }) => {
  const formattedSelectedDate = splitDateTime(selectedDate).date; //01-10-2025

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  const dayName = DayName(formattedSelectedDate);
  const { data: availability } = useAppSelector((state) => state.availability);
  const daySchedule = availability.find(d => d.day === dayName && d.active);
  
  if (!daySchedule) return (
    <div className="md:w-2/3 flex justify-center items-center font-bold font-serif text-2xl  ">
      <p className="underline underline-offset-4 border-b-2 px-4 py-2 m-2 rounded-xl shadow-lg">Day Off</p>
    </div>
  );

  let timeSlots = allSlots.filter((slot) =>
    daySchedule.slots.includes(slot.value) // value = "HH:mm"
  );

  return (
    <div
      className="md:w-2/3 p-4 grid grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min content-start mt-10 min-h-0 "
    >
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
          "h-14  md:w-4/4 lg:w-auto border-2 rounded-lg transition hover:border-1 hover:border-primary overflow-auto";

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