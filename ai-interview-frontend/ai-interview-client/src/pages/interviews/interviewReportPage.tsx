import { Link, Navigate, useParams } from 'react-router-dom'
import { Download, Loader2 } from 'lucide-react'
import { useInterview, useDownloadReport } from '@/hooks/useInterviews'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { PageSpinner } from '@/components/loading/pageSpinner'
import { ErrorState } from '@/components/errors/errorState'
import { ScoreDial } from '@/components/interview/scoreDial'
import { QuestionBreakdown } from '@/components/interview/questionBreakDown'

export default function InterviewReportPage() {
  const { interviewId } = useParams<{ interviewId: string }>()
  const interviewQuery = useInterview(interviewId)
  const downloadReport = useDownloadReport()

  if (!interviewId) return <Navigate to="/interviews" replace />
  if (interviewQuery.isLoading) return <PageSpinner />

  const interview = interviewQuery.data
  if (interviewQuery.isError || !interview) {
    return <ErrorState title="Couldn't load this report" onRetry={() => interviewQuery.refetch()} />
  }

  const report = interview.report

  if (interview.status !== 'COMPLETED' || !report) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Report not available yet"
          message="This interview hasn't been completed, so there's no report to show."
        />
        <div className="mt-4 flex justify-center">
          <Button asChild>
            <Link to={`/interviews/${interviewId}`}>Resume interview</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-fg">{interview.title}</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {interview.mode.replace(/_/g, ' ')} · {formatDate(interview.createdAt)}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => downloadReport.mutate(interviewId)}
          disabled={downloadReport.isPending}
        >
          {downloadReport.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Download PDF
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <ScoreDial score={report.overallScore} />
          <p className="max-w-md text-sm leading-relaxed text-fg-muted">{report.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.strengths.map((item) => (
                <li key={item} className="text-sm text-fg-muted">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-warning">Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.weaknesses.map((item) => (
                <li key={item} className="text-sm text-fg-muted">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.suggestions.map((item) => (
              <li key={item} className="text-sm text-fg-muted">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-fg">Question-by-question</h2>
        <QuestionBreakdown questions={interview.questions ?? []} />
      </div>
    </div>
  )
}