'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const successRateChartConfig = {
  rate: { label: 'Success Rate', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

export function AutomationSuccessRateChart({ rate }: { rate: number }) {
  const chartData = [{ name: 'Success', rate }];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Automation Success Rate</CardTitle>
        <CardDescription>Percentage of successful job applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={successRateChartConfig} className="h-[100px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
             <XAxis type="number" dataKey="rate" domain={[0, 100]} hide />
             <YAxis type="category" dataKey="name" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="rate" fill="var(--color-rate)" radius={5} barSize={30}>
            </Bar>
          </BarChart>
        </ChartContainer>
         <div className="mt-2 text-center text-2xl font-bold">{rate}%</div>
      </CardContent>
    </Card>
  );
}

const proxyPerfChartConfig = {
  latency: { label: 'Avg. Latency (ms)', color: 'hsl(var(--accent))' },
} satisfies ChartConfig;

export function ProxyPerformanceChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Proxy Performance</CardTitle>
        <CardDescription>Average latency for residential proxies.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={proxyPerfChartConfig} className="h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="proxy" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="avgLatency" fill="var(--color-latency)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
