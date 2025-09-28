import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AuthService from "@/services/AuthService";
import type { Day } from "@/shared/enums/availability";
import { Messages, TIME_SLOTS } from "@/utils/constant";
import { generateTimeSlots } from "@/utils/helper/date&Time";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

interface Slot {
  time: string;
  timeShort: string;
  value: string;
}

const ScheduleAvailability = () => {
  const timeSlots: Slot[] = generateTimeSlots(
    TIME_SLOTS.STARTHOURS,
    TIME_SLOTS.ENDHOURS,
    TIME_SLOTS.INTERVAL
  );

  // default: Sunday selected
  const [activeDay, setActiveDay] = useState<Day>("Sunday");

  // schedule state: each day maps to an array of selected slot values
  const [schedule, setSchedule] = useState<Record<Day, string[]>>({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });

  // toggle slot selection for active day
  const handleSlotClick = (slotValue: string) => {
    setSchedule((prev) => {
      const currentSlots = prev[activeDay] || [];
      return {
        ...prev,
        [activeDay]: [...currentSlots, slotValue],
      };
    });
  };

  // save logic (later can call API)
  const handleSave = async () => {
    const hasEmptyDay = Object.values(schedule).some((slots) => slots.length === 0);

    if (hasEmptyDay) {
      toast.error("Please add working hours for all days before saving");
      return;
    }
    
    try {
      await AuthService.workTimeAPi(schedule);

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }
  };

  // const handleReset = () => {

  // };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-3 mt-2">
        <h2 className="text-lg font-semibold font-serif  underline underline-offset-4">
          WORKING HOURS
        </h2>
        {/* <div className="mr-5">
          <Button
            variant={"link"}
            className="cursor-pointer hover:border-b-2 w-25 border-black hover:scale-105 active:scale-95  hover:no-underline text-lg font-semibold font-mono"
            onClick={handleReset}
          >
						- RESET -
          </Button>
        </div> */}
      </div>


      <div className="flex gap-4 text-primary">
        {/* LEFT SIDE - Days */}
        <div className="basis-[30%] p-2 space-y-4 border border-primary/20 rounded-lg">
          {days.map((day) => (
            <div
              key={day}
              onClick={() => setActiveDay(day)}
              className={`p-2 border rounded-lg cursor-pointer transition 
                ${activeDay === day ? "border-primary bg-chart-2 dark:bg-primary/15 " : "border-primary/30 hover:bg-primary/5"}`}
            >
              <div className="flex items-center space-x-3">
                <Switch id={day} className="cursor-pointer" />
                <Label
                  htmlFor={day}
                  onClick={(e) => e.preventDefault()} // prevent label toggling switch
                  className="cursor-pointer text-lg font-bold font-roboto"
                >
                  {day}
                </Label>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - Slots */}
        <div className="basis-[70%]">
          <div className="grid grid-cols-4 gap-4 rounded-lg mt-2">
            {timeSlots.map((slot) => {
              const isSelected = schedule[activeDay].includes(slot.value);
              return (
                <button
                  key={slot.value}
                  onClick={() => handleSlotClick(slot.value)}
                  className={`h-12 border-1  rounded-lg flex items-center justify-center transition cursor-pointer
                    ${isSelected
                  ? " bg-chart-2 border-1 border-primary"
                  : "hover:border-primary bg-primary/90 text-primary-foreground  "
                }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
          <div className="text-end mt-5 mr-5">
            <Button
              className="cursor-pointer w-28 hover:scale-105 active:scale-95"
              onClick={handleSave}
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAvailability;

/*
    setSchedule((prev) => {
      const currentSlots = prev[activeDay] || [];
      const updated =
        currentSlots.includes(slotValue)
          ? currentSlots.filter((v) => v !== slotValue) // remove if already selected
          : [...currentSlots, slotValue]; // add if not selected
      return {
        ...prev,
        [activeDay]: updated,
      };
    });
    */