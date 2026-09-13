import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Loader2, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function ResumeDropzone({
  onFileSelected,
  isUploading,
}: {
  onFileSelected: (file: File) => void
  isUploading: boolean
}) {
  const [rejectionError, setRejectionError] = useState<string | null>(null)

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setRejectionError(null)
      if (rejections.length > 0) {
        const reason = rejections[0].errors[0]
        setRejectionError(
          reason?.code === 'file-too-large'
            ? 'That file is larger than 10MB — try a smaller PDF.'
            : 'Please upload a PDF file.',
        )
        return
      }
      if (accepted[0]) onFileSelected(accepted[0])
    },
    [onFileSelected],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled: isUploading,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors',
          isDragActive ? 'border-accent bg-accent-soft' : 'border-border hover:border-border-strong',
          isUploading && 'pointer-events-none opacity-60',
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="size-6 animate-spin text-fg-subtle" />
        ) : (
          <UploadCloud className="size-6 text-fg-subtle" />
        )}
        <div>
          <p className="text-sm font-medium text-fg">
            {isUploading ? 'Uploading...' : 'Drag and drop your resume here'}
          </p>
          <p className="mt-1 text-xs text-fg-subtle">or click to browse — PDF up to 10MB</p>
        </div>
      </div>
      {rejectionError && <p className="mt-2 text-xs text-danger">{rejectionError}</p>}
    </div>
  )
}