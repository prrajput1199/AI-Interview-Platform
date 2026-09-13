import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useInterview, useCompleteInterview, useGenerateQuestions, useSubmitAnswer } from '@/hooks/useInterviews'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { QuestionProgress } from '@/components/interview/QuestionProgress'
import type { Answer } from '@/types/interview'
import { PageSpinner } from '@/components/loading/pageSpinner'
import { ErrorState } from '@/components/errors/errorState'
import { AiLoadingState } from '@/components/feedback/aiLoadingstate'
import { EvaluationReveal } from '@/components/feedback/evaluationReveal'
import { AnswerEditor } from '@/components/interview/answerEditor'

export default function InterviewSessionPage() {
  const { interviewId } = useParams<{ interviewId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const interviewQuery = useInterview(interviewId)
  const generateQuestions = useGenerateQuestions()
  const submitAnswer = useSubmitAnswer(interviewId ?? '')
  const completeInterview = useCompleteInterview(interviewId ?? '')

  const [activeIndex, setActiveIndex] = useState(0)
  const [justAnswered, setJustAnswered] = useState<Answer | null>(null)
  const generationTriggered = useRef(false)

  const interview = interviewQuery.data
  const questions = useMemo(() => interview?.questions ?? [], [interview])

  // Kick off AI question generation exactly once, the first time we see an
  // interview that was created but hasn't had questions generated yet.
  useEffect(() => {
    if (!interview || !interviewId) return
    if (interview.status !== 'CREATED') return
    if (questions.length > 0) return
    if (generationTriggered.current) return

    generationTriggered.current = true
    generateQuestions.mutate(interviewId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interview', interviewId] })
      },
      onError: () => {
        generationTriggered.current = false
      },
    })
  }, [interview, interviewId, questions.length, generateQuestions, queryClient])

  // Land on the first unanswered question whenever fresh data arrives.
  useEffect(() => {
    if (questions.length === 0) return
    const firstUnanswered = questions.findIndex((q) => !q.answer)
    setActiveIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered)
  }, [questions])

  if (!interviewId) return <Navigate to="/interviews" replace />

  if (interviewQuery.isLoading) return <PageSpinner/>

  if (interviewQuery.isError || !interview) {
    return (
      <ErrorState
        title="Couldn't load this interview"
        onRetry={() => interviewQuery.refetch()}
      />
    )
  }

  if (interview.status === 'COMPLETED') {
    return <Navigate to={`/interviews/${interviewId}/report`} replace />
  }

  const isGenerating =
    interview.status === 'CREATED' && questions.length === 0

  if (isGenerating) {
    return (
      <Card>
        <CardContent>
          <AiLoadingState label="Preparing your personalized interview..." />
        </CardContent>
      </Card>
    )
  }

  const activeQuestion = questions[activeIndex]
  const answeredCount = questions.filter((q) => q.answer).length
  const allAnswered = answeredCount === questions.length && questions.length > 0

  function handleSubmit(answerText: string) {
    if (!activeQuestion) return
    submitAnswer.mutate(
      { questionId: activeQuestion.id, answer: answerText },
      {
        onSuccess: (result) => {
          setJustAnswered(result.answer)
        },
      },
    )
  }

  function handleNext() {
    setJustAnswered(null)
    setActiveIndex((i) => Math.min(i + 1, questions.length - 1))
  }

  function handleComplete() {
    completeInterview.mutate(undefined, {
      onSuccess: () => navigate(`/interviews/${interviewId}/report`),
    })
  }

  const revealedAnswer = justAnswered ?? activeQuestion?.answer ?? null
  const isLastQuestion = activeIndex === questions.length - 1

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fg">{interview.title}</p>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
              {interview.mode.replace(/_/g, ' ')}
            </span>
          </div>
          {/* <QuestionProgress questions={questions} currentIndex={activeIndex} /> */}
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-fg">{activeQuestion?.text}</p>
        </CardContent>
      </Card>

      {submitAnswer.isPending ? (
        <Card>
          <CardContent>
            <AiLoadingState label="Analyzing your answer..." />
          </CardContent>
        </Card>
      ) : revealedAnswer ? (
        <div className="space-y-4">
          <EvaluationReveal
            score={revealedAnswer.score}
            feedback={revealedAnswer.feedback}
            keywords={revealedAnswer.keywords}
          />
          <div className="flex justify-end">
            {isLastQuestion ? (
              <Button onClick={handleComplete} disabled={completeInterview.isPending}>
                {completeInterview.isPending && <Loader2 className="size-4 animate-spin" />}
                Complete Interview
              </Button>
            ) : (
              <Button onClick={handleNext}>Next Question</Button>
            )}
          </div>
        </div>
      ) : (
        <AnswerEditor onSubmit={handleSubmit} isSubmitting={submitAnswer.isPending} />
      )}

      {allAnswered && !revealedAnswer && (
        <div className="flex justify-end">
          <Button onClick={handleComplete} disabled={completeInterview.isPending}>
            {completeInterview.isPending && <Loader2 className="size-4 animate-spin" />}
            Complete Interview
          </Button>
        </div>
      )}
    </div>
  )
}