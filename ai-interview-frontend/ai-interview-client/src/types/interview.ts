export type ResumeStatus = 'PROCESSING' | 'PROCESSED' | 'FAILED'

export interface ResumeAnalysis {
  skills: string[]
  experienceYears: number
  projects: string[]
}

export interface Resume {
  id: string
  fileName: string
  fileUrl: string
  status: ResumeStatus
  createdAt: string
  analysis: ResumeAnalysis | null
}

export interface ResumeUploadResult {
  resumeId: string
  status: ResumeStatus
}