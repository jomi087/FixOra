interface BookingDatesInfoProps {
  dates: {
    day: string;
    dayShortName: string;
    date: string;
    month: string;
    fullDate: string;
  }[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const BookingDatesInfo: React.FC<BookingDatesInfoProps> = ({ dates, selectedDate, onDateChange }) => {
  return (
    <div className="flex justify-between items-center gap-5 border p-4 rounded-md overflow-x-auto thin-scrollbar">
      {dates.map((dateObj, idx) => (
        <button
          key={idx}
          onClick={() => onDateChange(dateObj.fullDate)}
          className={`flex-shrink-0 flex flex-col items-center rounded-md border px-3 py-2
          ${selectedDate === dateObj.fullDate ? "bg-chart-2 dark:scale-110 dark:bg-white/95" : "bg-white/95 text-black"} 
          hover:border-primary transition w-1/1 xs:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/8`}
        >
          <span className="text-sm font-medium">{dateObj.day}</span>
          <span className="text-lg font-semibold">{dateObj.date}</span>
          <span className="text-xs">{dateObj.month}</span>
        </button>
      ))}
    </div>
  );
};

export default BookingDatesInfo;
