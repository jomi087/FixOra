import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAvailability, saveAvailability, toggleAvailability } from "@/store/provider/availabilitySlice";
import { generateTimeSlots } from "@/utils/helper/Date&Time";
import { TIME_SLOTS } from "@/utils/constant";
import type { Day, LeaveOption } from "@/shared/types/availability";
import { toast } from "react-toastify";

// -- helper types --
type DayState = { slots: string[]; active: boolean };

// Build default schedule shape
const defaultSchedule = (): Record<Day, DayState> => ({
  Sunday: { slots: [], active: false },
  Monday: { slots: [], active: false },
  Tuesday: { slots: [], active: false },
  Wednesday: { slots: [], active: false },
  Thursday: { slots: [], active: false },
  Friday: { slots: [], active: false },
  Saturday: { slots: [], active: false },
});

const timeSlots = generateTimeSlots(
  TIME_SLOTS.STARTHOURS,
  TIME_SLOTS.ENDHOURS,
  TIME_SLOTS.INTERVAL
);

const ScheduleAvailability = () => {
  const dispatch = useAppDispatch();
  const { data: availability } = useAppSelector((s) => s.availability);

  const [activeDay, setActiveDay] = useState<Day>("Sunday");
  const [workingHours, setWorkingHours] = useState(false);
  const [error, setError] = useState("");

  // local UI schedule (single source of truth while editing)
  const [schedule, setSchedule] = useState<Record<Day, DayState>>(defaultSchedule());

  // Single modal state for all confirmations / leave choices
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<null | "leave" | "confirmSave">(null);
  const [pendingToggleArgs, setPendingToggleArgs] = useState<{ day: Day; active: boolean } | null>(null);
  // const [selectedLeaveOption, setSelectedLeaveOption] = useState<LeaveOption | null>(null);

  // load availability on mount
  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  // reflect server availability into local schedule when fetched
  useEffect(() => {
    if (!availability || availability.length === 0) return;
    const mapped = availability.reduce((acc: Record<Day, DayState>, d) => {
      acc[d.day as Day] = { slots: d.slots || [], active: d.active ?? false };
      return acc;
    }, defaultSchedule());
    setSchedule(mapped);
  }, [availability]);

  // Convenience: slots currently saved on server for activeDay
  const savedSlotsForActive = availability.find((d) => d.day === activeDay)?.slots || [];

  // Toggle a slot in local schedule (add/remove)
  const handleSlotClick = (slotValue: string) => {
    setSchedule((prev) => {
      const curr = prev[activeDay];
      const has = curr.slots.includes(slotValue);
      const nextSlots = has ? curr.slots.filter((s) => s !== slotValue) : [...curr.slots, slotValue];
      return { ...prev, [activeDay]: { ...curr, slots: nextSlots } };
    });
  };

  // Ask confirmation before saving the whole schedule
  const askSaveConfirmation = () => {
    const missingDay = (Object.entries(schedule) as [Day, DayState][])
      .find(([_day, data]) => data.slots.length === 0)?.[0];
    if (missingDay) {
      setError(`${missingDay} requires at least one working slot.`);
      return;
    }
    setError("");
    setModalMode("confirmSave");
    setModalOpen(true);
  };

  // Save handler (calls redux thunk)
  const handleSaveAvailability = async () => {
    setModalOpen(false);
    try {
      const resultAction = await dispatch(saveAvailability(schedule));
      if (!saveAvailability.fulfilled.match(resultAction)) {
        toast.error(resultAction.payload as string);
        return;
      }
      toast.success("Availability saved");
      setWorkingHours(false);
      setActiveDay("Sunday");
    } catch {
      toast.error("Failed to save availability");
    }
  };

  // Toggle availability (turn day on/off)
  const requestToggleAvailability = (args: { day: Day; active: boolean }) => {
    // if turning OFF, ask leave option first
    if (!args.active) {
      setPendingToggleArgs(args);
      // setSelectedLeaveOption(null);
      setModalMode("leave");
      setModalOpen(true);
      return;
    }

    // turn ON immediately
    (async () => {
      const resultAction = await dispatch(toggleAvailability(args));
      if (!toggleAvailability.fulfilled.match(resultAction)) {
        toast.error(resultAction.payload as string);
        return;
      }
      setSchedule((prev) => ({ ...prev, [args.day]: { ...prev[args.day], active: args.active } }));
    })();
  };

  // Confirm leave option and execute toggle
  const confirmLeaveAndToggle = async () => {
    if (!pendingToggleArgs) return;
    let selectedLeaveOption: LeaveOption = "every_week"; // temp line
    if (!selectedLeaveOption) {
      toast.error("Choose leave option");
      return;
    }
    setModalOpen(false);

    try {
      type payloadType = { day: string; active: boolean; leaveOption?: LeaveOption }
      const payload: payloadType = { ...pendingToggleArgs, leaveOption: selectedLeaveOption };
      const resultAction = await dispatch(toggleAvailability(payload));
      if (!toggleAvailability.fulfilled.match(resultAction)) {
        toast.error(resultAction.payload as string);
        return;
      }
      setSchedule((prev) => ({ ...prev, [pendingToggleArgs.day]: { ...prev[pendingToggleArgs.day], active: pendingToggleArgs.active } }));
      toast.success("Day toggled");
    } catch {
      toast.error("Failed to toggle day");
    } finally {
      setPendingToggleArgs(null);
      // setSelectedLeaveOption(null);
      setModalMode(null);
    }
  };

  // Helper to render a slot button class succinctly
  const slotClass = (slotValue: string, day: Day) => {
    const saved = (availability.find((d) => d.day === day)?.slots || []).includes(slotValue);
    const selected = schedule[day].slots.includes(slotValue);
    const removed = saved && !selected; // saved in backend but not selected now => user removed it

    if (removed) return "bg-red-500 text-white border-red-600";
    if (saved) return "bg-green-500 text-white border-primary cursor-not-allowed"; // visually indicate saved
    if (selected) return "bg-chart-2 border-primary";
    return "hover:border-primary bg-primary-foreground text-primary";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mt-4 m-3">
        <h2 className="text-lg font-semibold font-serif underline underline-offset-4">WORKING HOURS</h2>
        {!workingHours ? (
          <Button onClick={() => setWorkingHours(true)}>➕ EDIT</Button>
        ) : (
          <Button onClick={() => setWorkingHours(false)}>👉 Back</Button>
        )}
      </div>

      <div className="flex gap-4 text-primary">
        {/* left day list */}
        <div className="basis-[30%] p-2 space-y-4 border border-primary/20 rounded-lg">
          {availability.map((dayObj) => {
            const day = dayObj.day as Day;
            const serverSlots = dayObj.slots || [];
            const active = schedule[day].active;

            return (
              <div
                key={day}
                onClick={() => setActiveDay(day)}
                className={`p-2 border rounded-lg cursor-pointer transition ${activeDay === day ? "border-primary bg-chart-2 dark:bg-primary/15" : "border-primary/30 hover:bg-primary/5"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Label className="cursor-pointer text-lg font-bold font-roboto" onClick={(e) => e.preventDefault()}>{day}</Label>
                  </div>

                  <div>
                    {/* show switch only if the provider has slots set for that day (server data) */}
                    {serverSlots.length > 0 && !workingHours && (
                      <Switch
                        id={day}
                        checked={active}
                        onCheckedChange={(checked) => requestToggleAvailability({ day, active: checked })}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* right content */}
        {!workingHours ? (
          <div className="basis-[70%]">
            {savedSlotsForActive.length === 0 ? (
              <div className="flex justify-center items-center h-[80%]"><p className="text-xl font-roboto font-bold">Work Time Not Set</p></div>
            ) : (
              <>
                <h3 className="text-md font-semibold mb-2">{activeDay} Slots</h3>
                <div className="grid grid-cols-4 gap-3">
                  {savedSlotsForActive.map((slot, idx) => (
                    <div key={idx} className={`p-2 border rounded-lg text-center ${schedule[activeDay]?.active ? "bg-chart-2/70" : "bg-gray-100 text-gray-600"}`}>
                      {slot}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="basis-[70%]">
            <p className="text-sm text-primary/50 font-semibold mb-2">* Select a time slot to add it, or click an existing one to remove it from {activeDay}.</p>
            <div className="grid grid-cols-4 gap-4 rounded-lg mt-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => handleSlotClick(slot.value)}
                  className={`h-12 border rounded-lg flex items-center justify-center transition cursor-pointer ${slotClass(slot.value, activeDay)}`}
                  disabled={false}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            <div className="flex justify-end-safe gap-3 mt-5 mr-5">
              <p className="text-red-400 font-semibold text-sm font-roboto pt-2">{error}</p>

              {error ? (
                <Button onClick={() => setError("")}>OK</Button>
              ) : (
                <Button variant={"success"} onClick={askSaveConfirmation} className="w-28">SAVE</Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Unified modal used for both leave choice and save confirmation */}
      <Dialog
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) {
            setModalMode(null);
            setPendingToggleArgs(null);
            // setSelectedLeaveOption(null);
          }
        }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{modalMode === "leave" ? "Leave Request" : "Confirm Save"}</DialogTitle>
            <DialogDescription>
              {modalMode === "leave" ? "Confirm how you’d like to schedule your leave." : "Save availability? This will overwrite your existing schedule."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2 text-sm">
            {modalMode === "leave" && (
              <>
                <p>You have requested leave on <span className="font-medium">{pendingToggleArgs?.day}</span>.</p>
                {/* <p>Would you like this leave only for this week, or repeat it every week?</p> */}
                {/* <div className="flex gap-3 mt-3">
                  <button className={`px-3 py-2 rounded ${selectedLeaveOption === "this_week" ? "bg-chart-2 text-white" : "border"}`} onClick={() => setSelectedLeaveOption("this_week")}>This Week</button>
                  <button className={`px-3 py-2 rounded ${selectedLeaveOption === "every_week" ? "bg-chart-2 text-white" : "border"}`} onClick={() => setSelectedLeaveOption("every_week")}>Every Week</button>
                </div> */}
              </>
            )}

            {modalMode === "confirmSave" && (
              <div>
                <p className="mb-4">Below are the working hour slots you have selected for each day. Please review them before saving.</p>
                <ul className="font-roboto list-disc p-1 flex justify-between flex-wrap gap-4">
                  {Object.entries(schedule).map(([d, val]) => (
                    <li
                      className="w-[138px] text-sm  border"
                      key={d}>
                      <strong
                        className="text-xs"
                      >
                        {d}
                      </strong>
                      : {val.slots.length} slot(s)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            {modalMode === "leave" ? (
              <Button variant="destructive" onClick={confirmLeaveAndToggle}>Confirm Leave</Button>
            ) : (
              <Button variant="success" onClick={handleSaveAvailability}>Yes, Save</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ScheduleAvailability;
