import { Badge } from '@/components/ui/badge'
import type { InterviewStatus } from '@/types/interview'

const CONFIG: Record<InterviewStatus, { label: string; variant: 'neutral' | 'accent' | 'success' }> = {
  CREATED: { label: 'Created', variant: 'neutral' },
  IN_PROGRESS: { label: 'In progress', variant: 'accent' },
  COMPLETED: { label: 'Completed', variant: 'success' },
}

export function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
  const config = CONFIG[status] ?? CONFIG.CREATED
  return <Badge variant={config.variant}>{config.label}</Badge>
}