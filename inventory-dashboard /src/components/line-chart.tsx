import { CartesianGrid, Legend, Line, LineChart, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";


interface ChartLineMultipleProps {
  chartData: {
    date: string;
    stock: number;
    demand: number;
  }[]| undefined;
  dateRange: string;
}

const formatDate = (date: string, range: string, index: number) => {
  switch (range) {
    case '7d':
      return format(new Date(date), 'MMM d');
    case '14d':
      return index % 2 === 0 ? format(new Date(date), 'MMM d') : '';
    case '30d':
      return index % 5 === 0 ? format(new Date(date), 'MMM d') : '';
    default:
      return date;
  }
};


const chartConfig = {
  stock: {
    label: "Total Stock",
    color: "var(--chart-1)",
  },
  demand: {
    label: "Total Demand",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;


export function ChartLineMultiple({ chartData, dateRange }: ChartLineMultipleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock vs Demand Trend</CardTitle>
        <CardDescription>Visualizing stock and demand over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              textAnchor="end"
              tickFormatter={(value, index) => formatDate(value, dateRange, index)} 
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="text-black"/>} />
            <Line
              dataKey="stock" 
              type="monotone"
              stroke="var(--color-stock)"
              strokeWidth={2}
              dot={true}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="demand" 
              type="monotone"
              stroke="var(--color-demand)"
              strokeWidth={2}
              dot={true}
              activeDot={{ r: 6 }}
            />
            <Legend verticalAlign="top" align="right" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}