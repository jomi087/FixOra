import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Day, LeaveOption } from "@/shared/types/availability";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAvailability, saveAvailability, toggleAvailability } from "@/store/provider/availabilitySlice";
import { generateTimeSlots } from "@/utils/helper/Date&Time";
import { TIME_SLOTS } from "@/utils/constant";
import { toast } from "react-toastify";
import ConfirmationBar from "@/components/common/modal/ConfirmationBar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const timeSlots = generateTimeSlots(
  TIME_SLOTS.STARTHOURS,
  TIME_SLOTS.ENDHOURS,
  TIME_SLOTS.INTERVAL
);

const ScheduleAvailability = () => {
  const [activeDay, setActiveDay] = useState<Day>("Sunday");
  const [workingHours, setWorkingHours] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [leaveOption, setLeaveOption] = useState<LeaveOption | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingArgs, setPendingArgs] = useState<{ day: Day; active: boolean } | null>(null);

  // Why schedule is not of type DayScedule ? (answer given below)
  const [schedule, setSchedule] = useState<Record<Day, { slots: string[], active: boolean }>>({
    Sunday: { slots: [], active: false },
    Monday: { slots: [], active: false },
    Tuesday: { slots: [], active: false },
    Wednesday: { slots: [], active: false },
    Thursday: { slots: [], active: false },
    Friday: { slots: [], active: false },
    Saturday: { slots: [], active: false },
  });

  const dispatch = useAppDispatch();
  const { data: availability } = useAppSelector((state) => state.availability);
  const activeDaySlots = availability.find((d) => d.day === activeDay)?.slots || [];

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  useEffect(() => {
    if (availability.length > 0) {
      const updatedSchedule = availability.reduce((acc, dayObj) => {
        acc[dayObj.day] = {
          slots: dayObj.slots || [],
          active: dayObj.active ?? false,
        };
        return acc;
      }, {} as Record<Day, { slots: string[]; active: boolean }>);

      setSchedule(updatedSchedule);
    }
  }, [availability]);

  const handleSlotClick = (slotValue: string) => {
    setSchedule(prev => {
      const currentSlots = prev[activeDay].slots;
      const updatedSlots = currentSlots.includes(slotValue)
        ? currentSlots.filter(s => s !== slotValue)
        : [...currentSlots, slotValue];
      return { ...prev, [activeDay]: { ...prev[activeDay], slots: updatedSlots } };
    });
  };

  const askConfirmation = () => {
    const hasEmptyDay = Object.values(schedule).some((day) => day.slots.length === 0);
    if (hasEmptyDay) {
      setError("* Please add working hours for all days before saving !");
      return;
    }
    setConfirmOpen(true);
  };

  const handleSaveAvailability = async () => {
    const resultAction = await dispatch(saveAvailability(schedule));
    if (!saveAvailability.fulfilled.match(resultAction)) {
      toast.error(resultAction.payload as string);
    }
    // setConfirmOpen(false);
    setWorkingHours(false);
    setActiveDay("Sunday");
  };


  const handleToggleAvailability = async (args: { day: Day; active: boolean }, leaveOption?: LeaveOption) => {

    if (!args.active && !leaveOption) {
      toast.error("Missing leave-Option");
      return;
    }
    const payload = args.active ? args : { ...args, leaveOption };

    const resultAction = await dispatch(toggleAvailability(payload));
    if (!toggleAvailability.fulfilled.match(resultAction)) {
      toast.error(resultAction.payload as string);
      return;
    }
    setSchedule((prev) => ({
      ...prev,
      [args.day]: { ...prev[args.day], active: args.active },
    }));
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-3 mt-2">
        <h2 className="text-lg font-semibold font-serif  underline underline-offset-4">
          WORKING HOURS
        </h2>
        {!workingHours ? (
          <Button
            className="cursor-pointer hover:bg-primary/90 active:scale-95"
            onClick={() => setWorkingHours(true)}
          >
            ➕ ADD
          </Button>
        ) : (
          <Button
            className="cursor-pointer hover:bg-primary/90 active:scale-95"
            onClick={() => setWorkingHours(false)}
          >
            👉 Back
          </Button>
        )}
      </div>

      <div className="flex gap-4 text-primary">
        <div className="basis-[30%] p-2 space-y-4 border border-primary/20 rounded-lg">
          {availability.map((dayObj) => (
            <div
              key={dayObj.day}
              onClick={() => setActiveDay(dayObj.day)}
              className={`p-2 border rounded-lg cursor-pointer transition 
                ${activeDay === dayObj.day ? "border-primary bg-chart-2 dark:bg-primary/15 " : "border-primary/30 hover:bg-primary/5"}`}
            >
              <div className="flex items-center space-x-3">
                {activeDaySlots.length > 0 && !workingHours &&
                  <Switch
                    id={dayObj.day}
                    className="cursor-pointer"
                    checked={schedule[dayObj.day].active}
                    onCheckedChange={(checked) => {
                      const args = { day: dayObj.day, active: checked };
                      setPendingArgs(args);
                      if (!checked) {
                        setOpen(true);
                        //setConfirmOpen(true);
                      } else {
                        handleToggleAvailability(args);
                      }
                    }}
                  />
                }
                <Label
                  htmlFor={dayObj.day}
                  onClick={(e) => e.preventDefault()} // prevent label toggling switch
                  className="cursor-pointer text-lg font-bold font-roboto"
                >
                  {dayObj.day}
                </Label>
              </div>
            </div>
          ))}
          {pendingArgs && leaveOption &&
            <ConfirmationBar
              confirmOpen={confirmOpen}
              setConfirmOpen={setConfirmOpen}
              handleAction={() => {
                handleToggleAvailability(pendingArgs, leaveOption);
              }}
              description="Are you sure you want to proceed ?"
              extraContent={
                <p className="font-roboto text-[12px]">
                  {`This action will cancel all existing bookings scheduled on ${activeDay} ${leaveOption === "this_week" ? "for this week" : "for every week"} .`}
                </p>
              }
            />
          }

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Leave Request</DialogTitle>
                <DialogDescription>
                  Confirm how you’d like to schedule your leave.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>You have requested leave on <span className="font-medium text-foreground">{activeDay}</span>.</p>
                <p>
                  Would you like this leave only for  this week,
                  or repeat it every week?
                </p>
              </div>

              <DialogFooter className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="cursor-pointer active:scale-95 "
                  disabled
                  onClick={() => {
                    setLeaveOption("this_week");
                    setConfirmOpen(true);
                    setOpen(false);
                  }}
                >
                  This Week
                </Button>
                <Button
                  className="cursor-pointer active:scale-95"
                  onClick={() => {
                    setLeaveOption("every_week");
                    setConfirmOpen(true);
                    setOpen(false);
                  }}
                >
                  Every Week
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!workingHours ? (
          <div className="basis-[70%]">
            {activeDaySlots.length === 0 ? (
              <div className="flex justify-center items-center h-[80%] jusbg-amber-800">
                <p className="text-xl font-roboto font-bold">Work Time Not Set</p>
              </div>
            ) : (
              <>
                <h3 className="text-md font-semibold mb-2">{activeDay} Slots</h3>
                <div className="grid grid-cols-4 gap-3">
                  {activeDaySlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-2 border rounded-lg text-center cursor-pointer 
                        ${schedule[activeDay]?.active ? "bg-chart-2/70" : "bg-gray-100 text-gray-600"}`}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="basis-[70%]">
            <div className="grid grid-cols-4 gap-4 rounded-lg mt-2">
              {timeSlots.map((slot) => {
                const isSaved = availability.find((d) => d.day === activeDay)?.slots.includes(slot.value);
                const isSelected = schedule[activeDay].slots.includes(slot.value);
                return (
                  <button
                    key={slot.value}
                    onClick={() => {
                      if (!isSaved) handleSlotClick(slot.value);
                    }}
                    disabled={isSaved}
                    className={`h-12 border-1 rounded-lg flex items-center justify-center transition cursor-pointer
                    ${isSaved ?
                    "bg-green-500 text-white border-primary cursor-not-allowed"
                    : isSelected ?
                      "bg-chart-2 border-1 border-primary"
                      : "hover:border-primary hover:border-1 bg-primary-foreground text-primary"
                  }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end-safe gap-3 mt-5 mr-5">
              <p className="text-red-400 font-semibold text-sm font-roboto pt-2">{error}</p>
              {error ? (
                <Button
                  className="cursor-pointer hover:scale-105 active:scale-95"
                  onClick={() => setError("")}
                >
                  OK
                </Button>
              ) : (
                <Button
                  variant={"success"}
                  className="cursor-pointer w-28 hover:scale-105 active:scale-95"
                  onClick={askConfirmation}
                >
                  SAVE
                </Button>
              )}
            </div>
            <ConfirmationBar
              confirmOpen={confirmOpen}
              setConfirmOpen={setConfirmOpen}
              handleAction={handleSaveAvailability}
              description="Are you sure you want to proceed? This action is permanent and cannot be undone."
            />
          </div>
        )}
      </div>
    </div >
  );
};

export default ScheduleAvailability;

/*
  instead of making schedule state of type DaySchedule
  i create a object type  state of schedule that cz of fast lookup O(1)
  or else of perticular day i might had to iterate O(n) (n = 7 (7 days [1 week]))
  and also this give me strong typing in  point of days
(normaly is donst make that deifference cz of  O(1) cs O(7) wont make that diffrence
  */