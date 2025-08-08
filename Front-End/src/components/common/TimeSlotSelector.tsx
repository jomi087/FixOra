
interface TimeSlotSelectorProps {
  timeSlots: {
    time: string;
    timeShort: string;
    value: string;
  }[],
  selectedTime: string;
  onTimeChange: (time: string) => void;
  bookedSlots : string[]

}
const TimeSlotSelector:React.FC<TimeSlotSelectorProps> = ({timeSlots,selectedTime,onTimeChange}) => {

  return (
    <div className="mt-6 border p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Select Time</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {timeSlots.map((slot, idx) => (
          <button
            key={idx}
            className={`py-2 px-4 rounded-md border shadow-md shadow-ring  text-sm hover:border-primary transition
              ${selectedTime === slot.value ? " border-primary " : "text-primary"}`}
            onClick={() => {
              console.log("selected-slot",slot)
              onTimeChange(slot.value)
            }}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
