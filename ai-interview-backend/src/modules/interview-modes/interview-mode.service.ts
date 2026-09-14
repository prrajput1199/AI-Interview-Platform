export interface InterviewModeOption {
  value: string
  label: string
}

export const INTERVIEW_MODES: InterviewModeOption[] = [
  { value: 'FRONTEND', label: 'Frontend Developer' },
  { value: 'BACKEND', label: 'Backend Developer' },
  { value: 'FULL_STACK', label: 'Full Stack Developer' },
  { value: 'REACT', label: 'React Developer' },
  { value: 'NODE', label: 'Node.js Developer' },
  { value: 'SYSTEM_DESIGN', label: 'System Design' },
  { value: 'DATABASE', label: 'Database Interview' },
  { value: 'DEVOPS', label: 'DevOps Interview' },
  { value: 'HR', label: 'HR Interview' },
  { value: 'BEHAVIORAL', label: 'Behavioral Interview' },
]

export const INTERVIEW_MODE_VALUES = INTERVIEW_MODES.map((m) => m.value) as [string, ...string[]]

export function getModeLabel(mode: string): string {
  return INTERVIEW_MODES.find((m) => m.value === mode)?.label ?? mode
}
