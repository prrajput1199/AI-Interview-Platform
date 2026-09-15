import { cn } from '@/lib/utils'
import type { Question } from '@/types/interview'

export function QuestionProgress({
  questions,
  currentIndex,
}: {
  questions: Question[]
  currentIndex: number
}) {
  const answeredCount = questions.filter((q) => q.answer).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-fg-subtle">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="tabular">{answeredCount} answered</span>
      </div>
      <div className="flex gap-1.5">
        {questions.map((q, i) => (
          <span
            key={q.id}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              q.answer
                ? 'bg-accent'
                : i === currentIndex
                  ? 'bg-border-strong'
                  : 'bg-bg-sunken',
            )}
          />
        ))}
      </div>
    </div>
  )
}
