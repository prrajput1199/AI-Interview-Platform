import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { QuestionPerformance } from '@/types/analytics'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '../empty-states/emptyStates'

function truncate(text: string, max = 42) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

export function QuestionPerformanceChart({ data }: { data: QuestionPerformance[] }) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No question data yet"
        description="Answer a few interview questions and their scores will show up here."
        className="border-none py-10"
      />
    )
  }

  const chartData = data.map((d) => ({ ...d, label: truncate(d.question) }))
  const height = Math.max(220, chartData.length * 44)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--color-border)" />
        <XAxis
          type="number"
          domain={[0, 10]}
          stroke="var(--border-strong)"
          tick={{ fill: 'var(--fg-subtle)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={200}
          stroke="var(--border-strong)"
          tick={{ fill: 'var(--fg-muted)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        {/* <Tooltip
          contentStyle={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value: number) => [value.toFixed(1), 'Score']}
          labelFormatter={(_, payload) => payload?.[0]?.payload.question ?? ''}
        /> */}
        <Bar dataKey="score" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}