import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const MIN_LENGTH = 20

export function AnswerEditor({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (answer: string) => void
  isSubmitting: boolean
}) {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmed = value.trim()
  const invalid = touched && trimmed.length < MIN_LENGTH

  function handleSubmit() {
    setTouched(true)
    if (trimmed.length < MIN_LENGTH || isSubmitting) return
    onSubmit(trimmed)
  }

  return (
    <div className="space-y-2.5">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="Type your answer here — be as specific as you'd be in a real interview."
        rows={7}
        invalid={invalid}
        disabled={isSubmitting}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit()
        }}
      />
      <div className="flex items-center justify-between">
        <p className={`text-xs ${invalid ? 'text-danger' : 'text-fg-subtle'}`}>
          {invalid
            ? `Write at least ${MIN_LENGTH} characters so the AI has enough to evaluate.`
            : `${trimmed.length} characters · ⌘/Ctrl + Enter to submit`}
        </p>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Submit Answer
        </Button>
      </div>
    </div>
  )
}