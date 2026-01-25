import ChartBar from "../../common/other/ChartBar";
import ChartPie from "./ChartPie";
import SectionCards from "./SectionCards";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type {
  BaseStats,
  BookingStats,
  TimeRange,
  GrowthStats,
  BookingServiceStats,
  TopProvider,
} from "@/shared/types/dashboard";
import { AxiosError } from "axios";
import { Messages } from "@/utils/constant";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { fillMissingChartData } from "@/utils/helper/FillMissingChartDate";
import { toPascalCase } from "@/utils/helper/utils";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

const chartConfig = {
  bookingCount: { label: "Bookings", color: "#3b82f6" },
  bookingRevenue: { label: "Revenue", color: "#10b981" },
} satisfies ChartConfig;

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "yearly", label: "Yearly" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 3 }, (_, i) => {
  const year = currentYear - i;
  return { label: year.toString(), value: year };
});

const Dashboard = () => {
  const [stats, setStats] = useState<BaseStats | null>(null);
  const [newStats, setNewStats] = useState<GrowthStats | null>(null);
  const [chartData, setChartData] = useState<BookingStats[]>([]);
  const [pieData, setPieData] = useState<BookingServiceStats[]>([]);
  const [topProviders, setTopProivders] = useState<TopProvider[]>([]);

  const [timeRange, setTimeRange] = useState<TimeRange>("yearly");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState(false);

  /** Derive date range (NO state) */
  const getDateRange = () => {
    const baseDate =
      timeRange === "yearly" ? new Date(selectedYear, 0, 1) : new Date();

    switch (timeRange) {
    case "daily":
      return {
        from: startOfDay(baseDate),
        to: endOfDay(baseDate),
      };
    case "weekly":
      return {
        from: startOfWeek(baseDate, { weekStartsOn: 1 }),
        to: endOfWeek(baseDate, { weekStartsOn: 1 }),
      };
    case "monthly":
      return {
        from: startOfMonth(baseDate),
        to: endOfMonth(baseDate),
      };
    case "yearly":
    default:
      return {
        from: startOfYear(baseDate),
        to: endOfYear(baseDate),
      };
    }
  };

  /** Handlers (UI untouched) */
  const onTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);

    if (range === "yearly") {
      setSelectedYear(currentYear);
    }
  };

  const onYearChange = (year: number) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { from, to } = getDateRange();

        const res = await AuthService.DashboardData({
          timeRange,
          from: from.toISOString(),
          to: to.toISOString(),
        });

        setStats(res.data.overview);
        setNewStats(res.data.growth);

        setChartData(fillMissingChartData(res.data.bookingsOverTime, timeRange, selectedYear ));

        setPieData(res.data.bookingsByService);
        setTopProivders(res.data.topProviders);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          err?.response?.data?.message || Messages.FAILED_TO_FETCH_DATA,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, selectedYear]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-2 m-2">
      <div className=" w-full lg:w-[75%] space-y-2 pt-2">
        <SectionCards stats={stats} />

        <div className="flex justify-between items-center gap-2">
          <div className="flex w-full justify-between border-2 items-center bg-primary-foreground p-2 pr-5 rounded-lg hover:shadow-lg transition-shadow duration-200">
            <p className="font-serif text-sm text-pr text-primary">
              New Customers:
            </p>
            <p>{newStats?.newCustomers ?? "N/A"}</p>
          </div>

          <div className="flex w-full justify-between items-center bg-primary-foreground border-2 p-2 pr-5 rounded-lg hover:shadow-lg transition-shadow duration-200">
            <p className="font-serif text-sm text-primary">New Providers:</p>
            <p>{newStats?.newProviders ?? "N/A"}</p>
          </div>

          <div className="hover:shadow-lg transition-shadow duration-200">
            <Select
              value={timeRange}
              onValueChange={(val) => onTimeRangeChange(val as TimeRange)}
            >
              <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto !text-primary !bg-primary-foreground sm:flex py-5 shadow-md"
                aria-label="Select range"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {timeRangeOptions.map((tr) => (
                  <SelectItem key={tr.value} value={tr.value}>
                    {tr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            {timeRange === "yearly" && (
              <Select
                value={selectedYear.toString()}
                onValueChange={(val) => onYearChange(Number(val))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((y) => (
                    <SelectItem key={y.value} value={y.value.toString()}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-[50%]">
            <ChartBar
              timeRange={timeRange}
              chartKey="bookingCount"
              chartConfig={
                chartConfig.bookingCount as {
                  label: string
                  color: string
                }
              }
              title="Booking Count"
              description="Shows the number of Bookings over time"
              data={chartData}
              loading={loading}
            />
          </div>

          <div className="w-full md:w-[50%]">
            <ChartBar
              timeRange={timeRange}
              chartKey="bookingRevenue"
              chartConfig={
                chartConfig.bookingRevenue as {
                  label: string
                  color: string
                }
              }
              title="Booking Revenue"
              description="Shows the booking Revenue over time"
              data={chartData}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[25%] space-y-2">
        <ChartPie timeRange={timeRange} data={pieData} />

        <div className="p-2 rounded-xl border shadow-sm w-full max-w-sm">
          <header className="mb-2">
            <h3 className="text-sm font-semibold tracking-wider underline underline-offset-6 text-primary">
              Top 3 Providers
            </h3>
          </header>

          <ul className="space-y-1">
            {topProviders.length > 0 ? (
              topProviders.map((p, index) => (
                <li
                  key={p.providerUserId}
                  className="flex items-center justify-between rounded-md border text-primary px-3 py-2 text-sm font-medium hover:bg-primary-foreground transition-colors"
                >
                  <span className="text-xs">
                    {toPascalCase(p.providerName)}
                  </span>
                  <span className="text-xs">#{index + 1}</span>
                </li>
              ))
            ) : (
              <li className="w-full text-center py-2 text-gray-500">
                Data Not Found
              </li>
            )}
          </ul>

          <span className="text-[10px] tracking-wide font-roboto ml-2">
            * This is selected on basis of no of jobs
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
