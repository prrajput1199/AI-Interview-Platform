import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TrendPoint } from '@/types/analytics'
import { formatDate } from '@/lib/utils'
import { LineChart as LineChartIcon } from 'lucide-react'
import { EmptyState } from '../empty-states/emptyStates'

export function PerformanceTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={LineChartIcon}
        title="No trend data yet"
        description="Complete a few interviews and your score trend will show up here."
        className="border-none py-10"
      />
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value, { month: 'short', day: 'numeric', year: undefined })}
          stroke="var(--border-strong)"
          tick={{ fill: 'var(--fg-subtle)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 10]}
          stroke="var(--border-strong)"
          tick={{ fill: 'var(--fg-subtle)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        {/* <Tooltip
          contentStyle={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(value: string) => formatDate(value)}
          formatter={(value: number) => [value.toFixed(1), 'Score']}
        /> */}
        <Line
          type="monotone"
          dataKey="score"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-chart-1)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}