import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useDeleteResume, useResume, useUploadResume } from '@/hooks/useResume'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ApiError } from '@/lib/api/client'
import { formatDate } from '@/lib/utils'
import { ResumeDropzone } from '@/components/resume/resumeDropZone'
import { ErrorState } from '@/components/errors/errorState'
import { AiLoadingState } from '@/components/feedback/aiLoadingstate'
import { ResumeAnalysisView } from '@/components/resume/resumeAnalysisView'

export default function ResumePage() {
  const resume = useResume()
  const upload = useUploadResume()
  const remove = useDeleteResume()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const hasResume = resume.isSuccess && Boolean(resume.data)
  // GET /resume 404s when no resume exists — that's an empty state, not a failure.
  const notFound = resume.isError && resume.error instanceof ApiError && resume.error.status === 404
  const failedToLoad = resume.isError && !notFound

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Resume</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Upload your resume to personalize your interview questions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {resume.isLoading && <Skeleton className="h-40 w-full" />}

          {!resume.isLoading && notFound && (
            <ResumeDropzone
              onFileSelected={(file) => upload.mutate(file)}
              isUploading={upload.isPending}
            />
          )}

          {!resume.isLoading && failedToLoad && (
            <ErrorState onRetry={() => resume.refetch()} />
          )}

          {hasResume && resume.data!.status === 'PROCESSING' && (
            <AiLoadingState label="Analyzing your resume..." />
          )}

          {hasResume && resume.data!.status === 'FAILED' && (
            <div className="space-y-4">
              <ErrorState
                title="We couldn't process this resume"
                message="Try uploading it again, or use a different file."
              />
              <ResumeDropzone
                onFileSelected={(file) => upload.mutate(file)}
                isUploading={upload.isPending}
              />
            </div>
          )}

          {hasResume && resume.data!.status === 'PROCESSED' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border bg-bg-sunken p-4">
                <div>
                  <p className="text-sm font-medium text-fg">{resume.data!.fileName}</p>
                  <p className="mt-0.5 text-xs text-fg-subtle">
                    Uploaded {formatDate(resume.data!.createdAt)}
                  </p>
                </div>
                <ConfirmDialog
                  open={confirmOpen}
                  onOpenChange={setConfirmOpen}
                  trigger={
                    <Button variant="ghost" size="icon" aria-label="Delete resume">
                      <Trash2 className="size-4 text-danger" />
                    </Button>
                  }
                  title="Delete this resume?"
                  description="This removes the file and its analysis. You can upload a new one anytime."
                  confirmLabel="Delete resume"
                  isLoading={remove.isPending}
                  onConfirm={() =>
                    remove.mutate(resume.data!.id, {
                      onSuccess: () => setConfirmOpen(false),
                    })
                  }
                />
              </div>

              {resume.data!.analysis && (
                <ResumeAnalysisView analysis={resume.data!.analysis} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}