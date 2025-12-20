import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { BookingStats, TimeRange } from "@/shared/typess/dashboard";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";

interface BookingChartProps {
  timeRange: TimeRange
  chartKey: string
  chartConfig: { label: string; color: string };
  title: string;
  description: string;
  data: BookingStats[];
  loading: boolean;
}

const ChartBar: React.FC<BookingChartProps> = ({ timeRange, chartKey, chartConfig, title, description, data }) => {

  const chartData = data;
  const formatXAxis = useCallback((value: string) => {
    const date = new Date(value);
    switch (timeRange) {
    case "yearly":
      return date.toLocaleString("en-US", { month: "short" }); // Jan, Feb
    case "monthly":
      return date.getDate().toString(); // 1, 2, 3
    case "weekly":
      return date.toLocaleString("en-US", { weekday: "short" }); // Mon, Tue
    case "daily":
      return date.toLocaleTimeString("en-US", { hour: "2-digit" }); // 00, 01, 02
    default:
      return "";
    }
  }, [timeRange]);

  return (
    <Card >
      <CardHeader className="flex justify-between items-center space-y-0 sm:flex-row">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="sr-only">{description}</CardDescription>
        </div>
        <Badge
          variant="secondary">
          {timeRange.toUpperCase()}
        </Badge>
      </CardHeader>

      {data?.length > 0 ? (
        <CardContent className="px-2">
          <ChartContainer config={{ [chartKey]: chartConfig }}>
            <BarChart data={chartData} margin={{ right: 10, left: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                // minTickGap={5}
                interval={timeRange === "daily" ? 2 : timeRange === "monthly" ? 1 : 0}
                tickFormatter={formatXAxis}
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
                        ...(timeRange === "daily" ? { hour: "2-digit" } : {}),
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Bar
                isAnimationActive={false}
                dataKey={chartKey}
                fill={chartConfig.color}
                radius={[4, 4, 0, 0]}
                name={chartConfig.label}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      ) : (
        <CardContent className="px-2">
          <div className="p-6 text-center text-sm text-gray-500">No data available</div>
        </CardContent>
      )}
    </Card>
  );
};

export default ChartBar;