import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import type { Interview } from '@/types/interview'
import { formatDate, formatScore } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InterviewStatusBadge } from './Interviewstatusbadge'

function targetFor(interview: Interview) {
  return interview.status === 'COMPLETED'
    ? `/interviews/${interview.id}/report`
    : `/interviews/${interview.id}`
}

export function InterviewHistoryTable({ interviews }: { interviews: Interview[] }) {
  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full text-sm sm:table">
        <thead>
          <tr className="border-b border-border text-left text-xs text-fg-subtle">
            <th className="py-3 font-medium">Title</th>
            <th className="py-3 font-medium">Mode</th>
            <th className="py-3 font-medium">Date</th>
            <th className="py-3 font-medium">Status</th>
            <th className="py-3 font-medium">Score</th>
            <th className="py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {interviews.map((interview) => (
            <tr key={interview.id}>
              <td className="max-w-[220px] truncate py-3.5 font-medium text-fg">
                {interview.title}
              </td>
              <td className="py-3.5 text-fg-muted">{interview.mode.replace(/_/g, ' ')}</td>
              <td className="py-3.5 text-fg-muted">{formatDate(interview.createdAt)}</td>
              <td className="py-3.5">
                <InterviewStatusBadge status={interview.status} />
              </td>
              <td className="py-3.5 font-mono text-fg-muted">{formatScore(interview.score)}</td>
              <td className="py-3.5 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={targetFor(interview)}>
                    <FileText className="size-3.5" />
                    View
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="space-y-3 sm:hidden">
        {interviews.map((interview) => (
          <li key={interview.id}>
            <Link
              to={targetFor(interview)}
              className="block rounded-lg border border-border bg-bg-raised p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-fg">{interview.title}</p>
                <span className="font-mono text-sm text-fg-muted">
                  {formatScore(interview.score)}
                </span>
              </div>
              <p className="mt-1 text-xs text-fg-subtle">
                {interview.mode.replace(/_/g, ' ')} · {formatDate(interview.createdAt)}
              </p>
              <div className="mt-2.5">
                <InterviewStatusBadge status={interview.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}