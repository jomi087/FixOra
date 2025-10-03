
import { Button } from "@/components/ui/button";
import { DATE_RANGE_DAYS } from "@/utils/constant";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
// import { Calendar as ShadCalendar } from "@/components/ui/calendar";

import "react-day-picker/dist/style.css";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  slot: boolean;
  setSlot: (slot: boolean) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate, setSlot, slot }) => {

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + DATE_RANGE_DAYS - 1);

  return (
    <div className="min-w-1/3 space-y-5 overflow-auto">
      <h1 className="text-lg font-serif">SELECT DATE</h1>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        required={true}
        captionLayout="label"
        className="rounded-lg border-2 shadow-lg mt-4 p-2 flex justify-center text-primary "
        classNames={{
          day_button: "day-button",
          weekday: "weekday-header",
          //disabled: "day-disabled",
        }}
        disabled={{ before: today, after: maxDate }}
        startMonth={new Date(today)}
        endMonth={new Date(maxDate)}
        components={{
          Chevron: (props) =>
            props.orientation === "left" ? (
              <ChevronLeftIcon {...props} />
            ) : (
              <ChevronRightIcon {...props} />
            ),
        }}
      />

      {/* <ShadCalendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        required
        className="rounded-lg border-2 shadow-lg mt-4 p-2 flex justify-center text-primary"
        disabled={{ before: today, after: maxDate }}
        defaultMonth={today}
        numberOfMonths={1}
        showOutsideDays={false}
      /> */}

      <div className="flex gap-4">
        <Button
          variant={"outline"}
          className={`cursor-pointer ${slot ? "bg-yellow-300 hover:bg-yellow-400" : ""}`}
          onClick={() => setSlot(true)}
        >
          All Slots
        </Button>
        <Button
          variant={"outline"}
          className={`cursor-pointer ${slot ? "" : "bg-yellow-300 hover:bg-yellow-400"}`}
          onClick={() => setSlot(false)}
        >
          Confirm Slots
        </Button>
      </div>

    </div>
  );
};

export default Calendar;
