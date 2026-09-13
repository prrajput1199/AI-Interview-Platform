import { useState } from 'react'
import { Coins, ShoppingCart, Target, TrendingUp } from 'lucide-react'
import {
  useDashboardStats,
  usePerformanceTrend,
  useQuestionPerformance,
  useSkillEvaluation,
} from '@/hooks/useAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart'
import { QuestionPerformanceChart } from '@/components/charts/QuestionPerformanceChart'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/dashboard/Statcard'
import { ErrorState } from '@/components/errors/errorState'
import { ImprovementPanel } from '@/components/dashboard/improvementPanel'


const RANGE_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
]

export default function AnalyticsPage() {
  const [days, setDays] = useState('30')
  const stats = useDashboardStats()
  const trend = usePerformanceTrend(Number(days))
  const skills = useSkillEvaluation()
  const questions = useQuestionPerformance()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Analytics</h1>
        <p className="mt-1 text-sm text-fg-muted">
          How your interview performance is trending over time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Target}
          label="Total interviews"
          value={String(stats.data?.totalInterviews ?? 0)}
          loading={stats.isLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Average score"
          value={stats.data ? stats.data.averageScore.toFixed(1) : '—'}
          loading={stats.isLoading}
        />
        <StatCard
          icon={ShoppingCart}
          label="Credits purchased"
          value={String(stats.data?.creditsPurchased ?? 0)}
          loading={stats.isLoading}
        />
        <StatCard
          icon={Coins}
          label="Credits used"
          value={String(stats.data?.creditsUsed ?? 0)}
          loading={stats.isLoading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Score trend</CardTitle>
          <Tabs value={days} onValueChange={setDays}>
            <TabsList>
              {RANGE_OPTIONS.map((opt) => (
                <TabsTrigger key={opt.value} value={opt.value}>
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {trend.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : trend.isError ? (
            <ErrorState onRetry={() => trend.refetch()} />
          ) : (
            <PerformanceTrendChart data={trend.data ?? []} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question performance</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : questions.isError ? (
            <ErrorState onRetry={() => questions.refetch()} />
          ) : (
            <QuestionPerformanceChart data={questions.data ?? []} />
          )}
        </CardContent>
      </Card>

      {skills.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : skills.isError ? (
        <ErrorState onRetry={() => skills.refetch()} />
      ) : (
        <ImprovementPanel
          strengths={skills.data?.strengths ?? []}
          weaknesses={skills.data?.weaknesses ?? []}
        />
      )}
    </div>
  )
}