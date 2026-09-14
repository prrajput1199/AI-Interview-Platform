export interface ResumeAnalysisDto {
  skills: string[]
  experienceYears: number
  projects: string[]
}

export interface ResumeDto {
  id: string
  fileName: string | null
  fileUrl: string
  status: string
  createdAt: string
  analysis: ResumeAnalysisDto | null
}

export interface ResumeUploadResultDto {
  resumeId: string
  status: string
}
