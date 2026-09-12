import { api } from './client'
import type { Resume, ResumeUploadResult } from '@/types/resume'

export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('resume', file)
    return api.post<ResumeUploadResult>('/api/v1/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  get: () => api.get<Resume>('/api/v1/resume'),
  remove: (resumeId: string) => api.delete<null>(`/api/v1/resume/${resumeId}`),
}