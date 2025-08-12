import { BookingStatus } from "@/shared/enums/BookingStatus";

interface TimeSlotSelectorProps {
  timeSlots: {
    time: string;
    timeShort: string;
    value: string;
  }[],
  selectedTime: string;
  onTimeChange: (time: string) => void;
  selectedDate : string
  bookedSlots: {
    bookingId: string;
    fullDate: string;
    time: string;
    status: BookingStatus;
  }[]

}
const TimeSlotSelector:React.FC<TimeSlotSelectorProps> = ({timeSlots,selectedTime,onTimeChange,selectedDate,bookedSlots}) => {
  return (
    <div className="mt-6 border p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Select Time</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {timeSlots.map((slot, idx) => {
          // Check if this time slot is booked on the selected date AND status is accepted or pending
          const isBooked = bookedSlots.some((booking) =>
            booking.fullDate === selectedDate &&
            booking.time === slot.value &&
            (booking.status === BookingStatus.ACCEPTED || booking.status === BookingStatus.PENDING)
          );
          // console.log(slot.value, selectedDate)
          const [day, month, year] = selectedDate.split("-").map(Number) as [number, number, number];
          const [hours, minutes] = slot.value.split(":").map(Number);
          const bookingDateTime = new Date(year, month - 1, day, hours, minutes);
          const isTimePassed = bookingDateTime.getTime() <= Date.now();
          
          //const TimePassed = 
          return (
            <button
              key={idx}
              disabled={isBooked || isTimePassed }
              onClick={() => {
                if (!isBooked && !isTimePassed ) onTimeChange(slot.value);
              }}
              title = { isBooked ? "Already booked" : isTimePassed ? "Un-Available" : "Book Now" }
              className={`py-2 px-4 rounded-md border shadow-md shadow-ring text-sm  hover:border-primary transition
                ${ isBooked  ? "bg-chart-2 cursor-not-allowed" : isTimePassed ? "opacity-50 cursor-not-allowed" : ""}
                ${selectedTime === slot.value && !isBooked ? " border-primary " : "text-primary"}
              `}
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

