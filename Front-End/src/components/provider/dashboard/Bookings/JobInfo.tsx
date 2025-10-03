import { Button } from "@/components/ui/button";
import WeeklyJobInfo from "./WeeklyJobInfo";
import DailyJobInfo from "./DailyJobInfo";
import { useState } from "react";

type ViewState = "weekly" | "daily"

const JobInfo = () => {
  const [viewState, setViewState] = useState<ViewState>("weekly");

  return (
    <div className="overflow-x-auto w-screen">
      <div className="flex gap-4 justify-end my-3 mr-10 ">
        <Button
          variant={"ghost"}
          className={`p-4 font-bold font-inter border-b-2 ${viewState == "weekly" && "border-primary"} rounded-b-none hover:bg-white hover:scale-90`}
          onClick={() => {
            setViewState("weekly");
          }}
        >
            Weekly
        </Button>
        <Button
          variant={"ghost"}
          className={`p-4 font-bold font-inter border-b-2 ${viewState == "daily" && "border-primary"} rounded-b-none hover:bg-white hover:scale-90`}
          onClick={() => setViewState("daily")}

        >
            Daily
        </Button>
      </div>
      {viewState == "weekly" && <WeeklyJobInfo />}
      {viewState == "daily" && <DailyJobInfo />}
    </div>
  );
};

export default JobInfo;