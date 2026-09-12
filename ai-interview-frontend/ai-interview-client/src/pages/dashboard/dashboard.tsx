import { Link } from 'react-router-dom'
import { ArrowRight, Coins, Sparkles, Target, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardStats, usePerformanceTrend, useSkillEvaluation } from '@/hooks/useAnalytics'
import { useInterviewList } from '@/hooks/useInterviews'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/dashboard/Statcard'
import { ErrorState } from '@/components/errors/errorState'
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart'
import { ImprovementPanel } from '@/components/dashboard/improvementPanel'
import { RecentInterviewsList } from '@/components/dashboard/recentInterviewList'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const stats = useDashboardStats()
  const trend = usePerformanceTrend(30)
  const skills = useSkillEvaluation()
  const interviews = useInterviewList(1, 5)

  const firstName = user?.name.split(' ')[0]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">
            {greeting()}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Ready to improve your interview performance?
          </p>
        </div>
        <Button asChild>
          <Link to="/interviews/new">
            <Sparkles className="size-4" />
            Start New Interview
          </Link>
        </Button>
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
          icon={Sparkles}
          label="Highest score"
          value={stats.data ? stats.data.highestScore.toFixed(1) : '—'}
          loading={stats.isLoading}
        />
        <StatCard
          icon={Coins}
          label="Credits remaining"
          value={String(stats.data?.creditsBalance ?? user?.creditWallet?.balance ?? 0)}
          loading={stats.isLoading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance over time</CardTitle>
          <Link to="/analytics" className="text-xs font-medium text-accent hover:underline">
            View analytics
          </Link>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent interviews</CardTitle>
          <Link
            to="/interviews"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {interviews.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : interviews.isError ? (
            <ErrorState onRetry={() => interviews.refetch()} />
          ) : (
            <RecentInterviewsList interviews={interviews.data?.interviews ?? []} />
          )}
        </CardContent>
      </Card>

      {skills.data && (
        <ImprovementPanel
          strengths={skills.data.strengths}
          weaknesses={skills.data.weaknesses}
        />
      )}
    </div>
  )
}