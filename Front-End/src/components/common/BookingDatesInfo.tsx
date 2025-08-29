interface BookingDatesInfoProps {
    dates: {
        day: string;
        dayShortName: string;
        date: string;
        month: string;
        fullDate: string;
    }[];
    selectedDate: string;
    onDateChange : (date: string) => void;
}

const BookingDatesInfo: React.FC<BookingDatesInfoProps> = ({ dates, selectedDate, onDateChange }) => {
  return (
    <div className="flex justify-between items-center gap-5 border p-4 rounded-md overflow-x-auto">
      {dates.map((dateObj, idx) => (
        <button
          key={idx}
          onClick={() => onDateChange(dateObj.fullDate)}
          className={`flex flex-col items-center md:w-xl px-4 py-2 rounded-md border 
                        ${selectedDate === dateObj.fullDate ? "bg-chart-2 dark:scale-115 dark:bg-white/95" : "bg-white/95 text-black"} 
                        hover:border-primary transition`}
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