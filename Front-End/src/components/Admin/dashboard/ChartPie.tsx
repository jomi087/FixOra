import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import type { TimeRange } from "@/shared/types/dashboard";
import { getServiceColor } from "@/utils/constant";

interface PieData {
  service: string;
  booked: number;
}

interface ChartPieProps {
  timeRange: TimeRange
  data: PieData[];
}

const ChartPie: React.FC<ChartPieProps> = ({ data, timeRange }) => {

  const chartConfig = data.reduce(
    (acc, item, index) => ({
      ...acc,
      [item.service]: {
        label: item.service,
        color: getServiceColor(index),
      },
    }),
    {}
  );

  return (
    <Card className="flex flex-col gap-0 p-0 pt-5">
      <CardHeader className="flex justify-between items-center space-y-0 sm:flex-row">
        <div className="space-y-2">
          <CardTitle className="underline underline-offset-4"> Services</CardTitle>
          <CardDescription className="sr-only">Services Pie Chart</CardDescription>
        </div>
        <Badge
          variant="secondary">
          {timeRange.toUpperCase()}
        </Badge>
      </CardHeader>
      {data?.length > 0 ? (
        <CardContent className="flex-1 p-0 ">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="booked" label nameKey="service">
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getServiceColor(index)}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="service" />}
                className="-translate-y-0 flex-wrap gap-2 *:basis-1/5 *:justify-center "
              />
            </PieChart>
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

export default ChartPie;
