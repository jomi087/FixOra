import SingleChart from "../../common/others/SingleChart";
import SectionCards from "./SectionCards";
import type { ChartConfig } from "@/components/ui/chart";


const chartConfig: ChartConfig = {
  bookingCount: {
    label: "Bookings",
    color: "var(--chart-3)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
};


const Dashboard = () => {

  return (
    <div className="w-full px-2 py-4 ">
      <div className="">
        <SectionCards />
        <div className="p-4 flex gap-5">
          <div className="md:w-[50%]">
            <SingleChart
              chartKey="bookingCount" 
              chartConfig={chartConfig.bookingCount as { label: string; color: string }}
              title="Booking Count"
              description="Shows the number of Bookings over time"
            />
          </div>
          <div className="md:w-[50%]">
            <SingleChart
              chartKey="revenue" 
              chartConfig={chartConfig.revenue as { label: string; color: string }}
              title="Booking Revenue"
              description="Shows the Revenue of bookings over time"
            />
          </div>
        </div>
        {/* <DataTable data={data} />  */}
      </div>
    </div>
  );
};

export default Dashboard;


