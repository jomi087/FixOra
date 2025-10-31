


import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", bookingCount: 222, revenue: 6473 },
  { date: "2024-04-02", bookingCount: 97, revenue: 3201 },
  { date: "2024-04-03", bookingCount: 167, revenue: 8294 },
  { date: "2024-04-04", bookingCount: 242, revenue: 5968 },
  { date: "2024-04-05", bookingCount: 373, revenue: 9865 },
  { date: "2024-04-06", bookingCount: 301, revenue: 7011 },
  { date: "2024-04-07", bookingCount: 245, revenue: 4578 },
  { date: "2024-04-08", bookingCount: 409, revenue: 9392 },
  { date: "2024-04-09", bookingCount: 59, revenue: 2218 },
  { date: "2024-04-10", bookingCount: 261, revenue: 8123 },
  { date: "2024-04-11", bookingCount: 327, revenue: 6284 },
  { date: "2024-04-12", bookingCount: 292, revenue: 7756 },
  { date: "2024-04-13", bookingCount: 342, revenue: 9082 },
  { date: "2024-04-14", bookingCount: 137, revenue: 3150 },
  { date: "2024-04-15", bookingCount: 120, revenue: 5664 },
  { date: "2024-04-16", bookingCount: 138, revenue: 2543 },
  { date: "2024-04-17", bookingCount: 446, revenue: 9529 },
  { date: "2024-04-18", bookingCount: 364, revenue: 8763 },
  { date: "2024-04-19", bookingCount: 243, revenue: 6548 },
  { date: "2024-04-20", bookingCount: 89, revenue: 1912 },
  { date: "2024-04-21", bookingCount: 137, revenue: 4984 },
  { date: "2024-04-22", bookingCount: 224, revenue: 7445 },
  { date: "2024-04-23", bookingCount: 138, revenue: 2347 },
  { date: "2024-04-24", bookingCount: 387, revenue: 9017 },
  { date: "2024-04-25", bookingCount: 215, revenue: 6874 },
  { date: "2024-04-26", bookingCount: 75, revenue: 1511 },
  { date: "2024-04-27", bookingCount: 383, revenue: 9824 },
  { date: "2024-04-28", bookingCount: 122, revenue: 2738 },
  { date: "2024-04-29", bookingCount: 315, revenue: 8851 },
  { date: "2024-04-30", bookingCount: 454, revenue: 9327 },
  { date: "2024-05-01", bookingCount: 165, revenue: 5660 },
  { date: "2024-05-02", bookingCount: 293, revenue: 7143 },
  { date: "2024-05-03", bookingCount: 247, revenue: 6781 },
  { date: "2024-05-04", bookingCount: 385, revenue: 8422 },
  { date: "2024-05-05", bookingCount: 481, revenue: 9994 },
  { date: "2024-05-06", bookingCount: 498, revenue: 9830 },
  { date: "2024-05-07", bookingCount: 388, revenue: 8754 },
  { date: "2024-05-08", bookingCount: 149, revenue: 4120 },
  { date: "2024-05-09", bookingCount: 227, revenue: 6542 },
  { date: "2024-05-10", bookingCount: 293, revenue: 7218 },
  { date: "2024-05-11", bookingCount: 335, revenue: 8934 },
  { date: "2024-05-12", bookingCount: 197, revenue: 5086 },
  { date: "2024-05-13", bookingCount: 197, revenue: 5773 },
  { date: "2024-05-14", bookingCount: 448, revenue: 9870 },
  { date: "2024-05-15", bookingCount: 473, revenue: 9325 },
  { date: "2024-05-16", bookingCount: 338, revenue: 8536 },
  { date: "2024-05-17", bookingCount: 499, revenue: 9972 },
  { date: "2024-05-18", bookingCount: 315, revenue: 7935 },
  { date: "2024-05-19", bookingCount: 235, revenue: 6134 },
  { date: "2024-05-20", bookingCount: 177, revenue: 5342 },
  { date: "2024-05-21", bookingCount: 82, revenue: 2280 },
  { date: "2024-05-22", bookingCount: 81, revenue: 1693 },
  { date: "2024-05-23", bookingCount: 252, revenue: 7614 },
  { date: "2024-05-24", bookingCount: 294, revenue: 8387 },
  { date: "2024-05-25", bookingCount: 201, revenue: 5670 },
  { date: "2024-05-26", bookingCount: 213, revenue: 6548 },
  { date: "2024-05-27", bookingCount: 420, revenue: 9212 },
  { date: "2024-05-28", bookingCount: 233, revenue: 6983 },
  { date: "2024-05-29", bookingCount: 78, revenue: 1884 },
  { date: "2024-05-30", bookingCount: 340, revenue: 8540 },
  { date: "2024-05-31", bookingCount: 178, revenue: 3921 },
  { date: "2024-06-01", bookingCount: 178, revenue: 4170 },
  { date: "2024-06-02", bookingCount: 470, revenue: 9785 },
  { date: "2024-06-03", bookingCount: 103, revenue: 2859 },
  { date: "2024-06-04", bookingCount: 439, revenue: 9627 },
  { date: "2024-06-05", bookingCount: 88, revenue: 2421 },
  { date: "2024-06-06", bookingCount: 294, revenue: 7248 },
  { date: "2024-06-07", bookingCount: 323, revenue: 8682 },
  { date: "2024-06-08", bookingCount: 385, revenue: 9091 },
  { date: "2024-06-09", bookingCount: 438, revenue: 9813 },
  { date: "2024-06-10", bookingCount: 155, revenue: 4097 },
  { date: "2024-06-11", bookingCount: 92, revenue: 2301 },
  { date: "2024-06-12", bookingCount: 492, revenue: 9970 },
  { date: "2024-06-13", bookingCount: 81, revenue: 1958 },
  { date: "2024-06-14", bookingCount: 426, revenue: 9351 },
  { date: "2024-06-15", bookingCount: 307, revenue: 7836 },
  { date: "2024-06-16", bookingCount: 371, revenue: 8472 },
  { date: "2024-06-17", bookingCount: 475, revenue: 9902 },
  { date: "2024-06-18", bookingCount: 107, revenue: 2678 },
  { date: "2024-06-19", bookingCount: 341, revenue: 8759 },
  { date: "2024-06-20", bookingCount: 408, revenue: 9424 },
  { date: "2024-06-21", bookingCount: 169, revenue: 4527 },
  { date: "2024-06-22", bookingCount: 317, revenue: 7881 },
  { date: "2024-06-23", bookingCount: 480, revenue: 9868 },
  { date: "2024-06-24", bookingCount: 132, revenue: 3122 },
  { date: "2024-06-25", bookingCount: 141, revenue: 3321 },
  { date: "2024-06-26", bookingCount: 434, revenue: 9422 },
  { date: "2024-06-27", bookingCount: 448, revenue: 9539 },
  { date: "2024-06-28", bookingCount: 149, revenue: 4127 },
  { date: "2024-06-29", bookingCount: 103, revenue: 2984 },
  { date: "2024-06-30", bookingCount: 446, revenue: 9385 },
];


interface BookingChartProps {
  chartKey: string
  chartConfig: { label: string; color: string }; 
  title: string;
  description: string;
  // chartData?: { // will do later
  //   date: Date,
  //   data: number
  // }
}


const SingleChart: React.FC<BookingChartProps> = ({
  chartKey,
  chartConfig,
  title,
  description,
}) => {
  const [timeRange, setTimeRange] = useState<
    "yearly" | "monthly" | "weekly" | "daily"
  >("monthly");

  const filteredData = useMemo(() => {
    const referenceDate = new Date("2024-06-30");
    const daysToSubtract =
      timeRange === "yearly"
        ? 365
        : timeRange === "monthly"
          ? 30
          : timeRange === "weekly"
            ? 7
            : 1;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle> 
          <CardDescription>{description}</CardDescription> 
        </div>
        <Select
          value={timeRange}
          onValueChange={(val: "yearly" | "monthly" | "weekly" | "daily") =>
            setTimeRange(val)
          }
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select range"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2">
        
        <ChartContainer config={{ [chartKey]: chartConfig }}>
          <BarChart data={filteredData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={chartKey} 
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey={chartKey} 
              fill={chartConfig.color} 
              radius={[4, 4, 0, 0]}
              name={chartConfig.label} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SingleChart;