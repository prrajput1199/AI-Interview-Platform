import { formatScore } from '@/lib/utils'
import type { Question } from '@/types/interview'

export function QuestionBreakdown({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-lg border border-border p-5">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-fg">
              <span className="mr-1.5 text-fg-subtle">{index + 1}.</span>
              {question.text}
            </p>
            {question.answer && (
              <span className="shrink-0 font-mono text-sm text-fg-muted">
                {formatScore(question.answer.score)}
              </span>
            )}
          </div>

          {question.answer ? (
            <>
              <p className="mt-3 rounded-md bg-bg-sunken p-3 text-sm text-fg-muted">
                {question.answer.text}
              </p>
              <p className="mt-3 text-sm text-fg-muted">{question.answer.feedback}</p>
              {question.answer.keywords && question.answer.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {question.answer.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-bg-sunken px-2.5 py-1 text-xs text-fg-muted"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-fg-subtle">Not answered.</p>
          )}
        </div>
      ))}
    </div>
  )
}