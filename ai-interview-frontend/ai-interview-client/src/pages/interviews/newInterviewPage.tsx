import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileWarning, Loader2 } from 'lucide-react'
import { useInterviewModes } from '@/hooks/useInterviewModes'
import { useResume } from '@/hooks/useResume'
import { useCreateInterview } from '@/hooks/useInterviews'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ModeCard } from '@/components/interview/ModeCard'
import { StepIndicator } from '@/components/ui/stepIndicator'

const STEPS = ['Mode', 'Resume', 'Title', 'Review']

export default function NewInterviewPage() {
  const navigate = useNavigate()
  const modes = useInterviewModes()
  const resume = useResume()
  const createInterview = useCreateInterview()

  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const resumeAvailable = resume.data?.status === 'PROCESSED'
  const selectedMode = modes.data?.find((m) => m.value === mode)

  const canAdvance = [Boolean(mode), true, title.trim().length > 2, true][step]

  async function handleStart() {
    if (!mode) return
    const interview = await createInterview.mutateAsync({
      mode,
      title: title.trim(),
      resumeId: resumeAvailable ? resume.data!.id : undefined,
    })
    navigate(`/interviews/${interview.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Start a new interview</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Four quick steps and your AI interview will be ready.
        </p>
      </div>

      <StepIndicator steps={STEPS} currentIndex={step} />

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div>
              {modes.isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(modes.data ?? []).map((m) => (
                    <ModeCard
                      key={m.value}
                      mode={m}
                      selected={mode === m.value}
                      onSelect={() => setMode(m.value)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {resume.isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : resumeAvailable ? (
                <div className="rounded-lg border border-accent bg-accent-soft p-4">
                  <p className="text-sm font-medium text-fg">{resume.data!.fileName}</p>
                  <p className="mt-1 text-xs text-fg-muted">
                    This resume will personalize your interview questions.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4">
                  <FileWarning className="mt-0.5 size-4 shrink-0 text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg">
                      {resume.data?.status === 'PROCESSING'
                        ? 'Your resume is still processing.'
                        : 'Upload your resume first.'}
                    </p>
                    <p className="mt-1 text-xs text-fg-muted">
                      You can still continue without one — questions just won't be
                      tailored to your background.
                    </p>
                    <Button variant="secondary" size="sm" className="mt-3" asChild>
                      <Link to="/resume">Go to Resume</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="title">Interview title</Label>
              <Input
                id="title"
                placeholder="e.g. Google Frontend Interview"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-fg-subtle">
                Give it a name you'll recognize later — the company, role, or focus area.
              </p>
            </div>
          )}

          {step === 3 && (
            <dl className="divide-y divide-border text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-fg-muted">Interview type</dt>
                <dd className="font-medium text-fg">{selectedMode?.label ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-fg-muted">Resume</dt>
                <dd className="font-medium text-fg">
                  {resumeAvailable ? resume.data!.fileName : 'None'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-fg-muted">Title</dt>
                <dd className="font-medium text-fg">{title}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance}>
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={handleStart} disabled={createInterview.isPending}>
            {createInterview.isPending && <Loader2 className="size-4 animate-spin" />}
            Start Interview
          </Button>
        )}
      </div>
    </div>
  )
}