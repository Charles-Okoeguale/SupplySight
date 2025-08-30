import { CartesianGrid, Legend, Line, LineChart, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LoadingSpinner } from "./ui/loading-spinner";
import { format } from "date-fns";

interface ChartLineMultipleProps {
  chartData: {
    date: string;
    stock: number;
    demand: number;
  }[]| undefined;
  dateRange: string;
  isLoading?: boolean;
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


export function ChartLineMultiple({ chartData, dateRange, isLoading }: ChartLineMultipleProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Stock vs Demand Trend</CardTitle>
        <CardDescription className="text-gray-600">Visualizing stock and demand over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                textAnchor="end"
                tickFormatter={(value, index) => formatDate(value, dateRange, index)} 
                className="text-gray-600"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent className="text-black"/>} />
              <Line
                dataKey="stock" 
                type="monotone"
                stroke="var(--color-stock)"
                strokeWidth={3}
                dot={{ fill: "var(--color-stock)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-stock)", strokeWidth: 2 }}
              />
              <Line
                dataKey="demand" 
                type="monotone"
                stroke="var(--color-demand)"
                strokeWidth={3}
                dot={{ fill: "var(--color-demand)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-demand)", strokeWidth: 2 }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '20px' }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}