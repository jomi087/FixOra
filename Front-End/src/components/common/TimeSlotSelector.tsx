import { BookingStatus } from "@/shared/enums/BookingStatus";
import { dateTime, splitDateTime } from "@/utils/helper/date&time";

interface TimeSlotSelectorProps {
  timeSlots: {
    time: string;
    timeShort: string;
    value: string;
  }[],
  selectedTime: string;
  onTimeChange: (time: string) => void;
  selectedDate: string;
  bookedSlots: {
    bookingId: string;
    scheduledAt: Date;
    status: BookingStatus;
  }[];
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedTime,
  onTimeChange,
  selectedDate,
  bookedSlots
}) => {
  return (
    <div className="mt-6 border p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Select Time</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {timeSlots.map((slot, idx) => {
          // Find booking for this slot on selectedDate
          const booking = bookedSlots.find((b) => {
            const { date, time } = splitDateTime(b.scheduledAt);
            return (
              date === selectedDate &&
              time === slot.value &&
              (b.status === BookingStatus.CONFIRMED ||b.status === BookingStatus.PENDING)
            );
          });

          const bookingDateTime = dateTime (selectedDate,slot.value);
          const isTimePassed = bookingDateTime.getTime() <= Date.now();

          // Base styles
          let slotClass = "py-2 px-4 rounded-md border shadow-md shadow-ring text-sm hover:border-primary transition ";

          if (booking?.status === BookingStatus.CONFIRMED) {
            slotClass += "bg-chart-2 cursor-not-allowed";
          } else if (booking?.status === BookingStatus.PENDING) {
            slotClass += "bg-orange-400 cursor-not-allowed";
          } else if (isTimePassed) {
            slotClass += "opacity-50 cursor-not-allowed";
          } else {
            slotClass += selectedTime === slot.value? "border-primary text-primary": "text-primary ";
          }
          
          return (
            <button
              key={idx}
              disabled={!!booking || isTimePassed}
              onClick={() => {
                if (!booking && !isTimePassed) onTimeChange(slot.value);
              }}
              title={
                booking
                  ? booking.status === BookingStatus.CONFIRMED ? "Already booked" : "Booking on Process"
                  : isTimePassed ? "Un-Available" : "Book Now"
              }
              className={`${slotClass} ${selectedTime === slot.value && !booking  ? " border-primary " : "text-primary"}`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
