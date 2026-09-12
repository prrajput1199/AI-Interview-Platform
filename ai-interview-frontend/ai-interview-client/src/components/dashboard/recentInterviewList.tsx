import { Link } from 'react-router-dom'
import { ChevronRight, ListChecks } from 'lucide-react'
import type { Interview } from '@/types/interview'
import { formatDate, formatScore } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InterviewStatusBadge } from '../interview/Interviewstatusbadge'
import { EmptyState } from '../empty-states/emptyStates'

export function RecentInterviewsList({ interviews }: { interviews: Interview[] }) {
  if (interviews.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="You haven't completed an interview yet"
        description="Start your first mock interview to see it appear here."
        action={
          <Button size="sm" asChild>
            <Link to="/interviews/new">Start Your First Interview</Link>
          </Button>
        }
      />
    )
  }

  return (
    <ul className="divide-y divide-border">
      {interviews.map((interview) => {
        const target =
          interview.status === 'COMPLETED'
            ? `/interviews/${interview.id}/report`
            : `/interviews/${interview.id}`
        return (
          <li key={interview.id}>
            <Link
              to={target}
              className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-bg-sunken -mx-2 px-2 rounded-md"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-fg">{interview.title}</p>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  {interview.mode.replace(/_/g, ' ')} · {formatDate(interview.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <InterviewStatusBadge status={interview.status} />
                <span className="w-8 text-right font-mono text-sm text-fg-muted">
                  {formatScore(interview.score)}
                </span>
                <ChevronRight className="size-4 text-fg-subtle" />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}