import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, Sparkles } from 'lucide-react'
import { useInterviewList } from '@/hooks/useInterviews'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/errors/errorState'
import { EmptyState } from '@/components/empty-states/emptyStates'
import { InterviewHistoryTable } from '@/components/interview/interviewHistoryTable'
import { Pagination } from '@/components/ui/Pagination'

export default function InterviewHistoryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useInterviewList(page, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Interviews</h1>
          <p className="mt-1 text-sm text-fg-muted">Every mock interview you've run.</p>
        </div>
        <Button asChild>
          <Link to="/interviews/new">
            <Sparkles className="size-4" />
            Start New Interview
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {isError && <ErrorState onRetry={() => refetch()} />}

          {!isLoading && !isError && (data?.interviews.length ?? 0) === 0 && (
            <EmptyState
              icon={ListChecks}
              title="You haven't completed an interview yet"
              description="Start your first mock interview to build your history."
              action={
                <Button size="sm" asChild>
                  <Link to="/interviews/new">Start Your First Interview</Link>
                </Button>
              }
            />
          )}

          {!isLoading && !isError && (data?.interviews.length ?? 0) > 0 && (
            <>
              <InterviewHistoryTable interviews={data!.interviews} />
              <Pagination pagination={data!.pagination} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}