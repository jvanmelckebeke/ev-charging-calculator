import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ChartDataPoint } from '@/lib/charging-calculator';

interface ChargingChartProps {
  data: ChartDataPoint[];
  targetPercent: number;
  isAchievable: boolean;
}

export function ChargingChart({ data, targetPercent, isAchievable }: ChargingChartProps) {
  const primaryColor = 'oklch(0.541 0.281 293.009)';
  const mutedColor = 'oklch(0.552 0.016 285.938)';
  const warningColor = 'oklch(0.577 0.245 27.325)';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: mutedColor }}
            tickLine={{ stroke: mutedColor }}
            axisLine={{ stroke: mutedColor }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: mutedColor }}
            tickLine={{ stroke: mutedColor }}
            axisLine={{ stroke: mutedColor }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'oklch(1 0 0)',
              border: '1px solid oklch(0.92 0.004 286.32)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
            formatter={(value) => [`${value}%`, 'Battery']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <ReferenceLine
            y={targetPercent}
            stroke={isAchievable ? primaryColor : warningColor}
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="percent"
            stroke={isAchievable ? primaryColor : warningColor}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: isAchievable ? primaryColor : warningColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
