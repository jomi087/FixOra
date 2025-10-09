import { Button } from "@/components/ui/button";
import WeeklyJobInfo from "./WeeklyJobInfo";
import DailyJobInfo from "./DailyJobInfo";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAvailability } from "@/store/provider/availabilitySlice";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";


type ViewState = "weekly" | "daily"

const JobInfo = () => {
  const [viewState, setViewState] = useState<ViewState>("daily");
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAvailability());
  }, [dispatch]);

  const { data: availability } = useAppSelector((state) => state.availability);

  useEffect(() => {
    if (availability.length > 0) {

      //if all slotsar empty that means its a new user  so show dialouge 
      const allEmpty = availability.every(dayObj => dayObj.slots.length === 0);
      if (allEmpty) {
        setOpen(true);
        setIsNew(true);
      }

      //if slots have value that means alredey provder has setting the time but not acitved 
      //so it in 7 days at all active is false then show dialouge  if ny at least 1 is true then no need 
      const inActive = availability.every(dayObj => dayObj.active === false);

      if (!allEmpty && inActive) {
        console.log("inActive", inActive);
        setOpen(true);
        setIsNew(false);
      }
    }
  }, [availability]);

  return (
    <div className="overflow-x-auto w-screen">
      <div className="flex gap-4 justify-end my-3 mr-10 ">
        <Button
          variant={"ghost"}
          className={`p-4 font-bold font-inter border-b-1 ${viewState == "weekly" && "border-primary"} rounded-b-none hover:bg-white hover:scale-90`}
          onClick={() => {
            setViewState("weekly");
          }}
        >
          Weekly
        </Button>
        <Button
          variant={"ghost"}
          className={`p-4 font-bold font-inter border-b-1 ${viewState == "daily" && "border-primary"} rounded-b-none hover:bg-white hover:scale-90`}
          onClick={() => setViewState("daily")}

        >
          Daily
        </Button>
      </div>
      {viewState == "weekly" && <WeeklyJobInfo />}
      {viewState == "daily" && <DailyJobInfo />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle
              className="font-roboto"
            >
              Set Your Availability
            </DialogTitle>
          </DialogHeader>

          {/* Detailed Explanation */}
          <div className="p-3 bg-gray-50 rounded-md text-sm text-muted-foreground space-y-2">
            {isNew ? (
              <>
                <p>Hi, welcome!</p>
                <p>Before getting started, you need to set up your working hours.</p>
                <p>
                  Without scheduling your availability, your profile will not be visible to users looking to book a provider.
                </p>
                <p>
                  Please configure your available time slots and activate them to start receiving bookings and ensure your profile is listed.
                </p>
              </>
            ) : (
              <>
                <p>You have not activated your working hours.</p>
                <p>
                  Without activating at least one day of availability, your profile will not be visible to users looking to book a provider.
                </p>
                <p>
                  Please activate your availability to start receiving bookings and make your profile visible to users.
                </p>
              </>
            )}
          </div>


          <DialogFooter className="">
            <Button
              variant="outline"
              className="cursor-pointer active:scale-95"
              onClick={() => {
                navigate("/provider/settings/availability");
                setOpen(false);
              }}
            >
              Schedule Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div >
  );
};

export default JobInfo;