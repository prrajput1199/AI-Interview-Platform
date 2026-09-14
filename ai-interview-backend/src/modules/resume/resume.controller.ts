import type { Request, Response } from 'express'
import { resumeService } from './resume.service'
import { sendAccepted, sendSuccess } from '@/utils/api-response'
import { BadRequestError } from '@/utils/errors'

export const resumeController = {
  async upload(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequestError('A PDF resume file is required', 'FILE_REQUIRED')
    }
    const result = await resumeService.uploadResume(req.user!.id, req.file)
    return sendAccepted(res, result, 'Resume uploaded. Analysis started.')
  },

  async getCurrent(req: Request, res: Response) {
    const resume = await resumeService.getCurrentResume(req.user!.id)
    return sendSuccess(res, resume)
  },

  async remove(req: Request, res: Response) {
    const { resumeId } = req.params
    await resumeService.deleteResume(req.user!.id, resumeId as string)
    return sendSuccess(res, null, 'Resume deleted successfully')
  },
}
