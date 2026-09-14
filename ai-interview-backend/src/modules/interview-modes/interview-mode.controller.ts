import type { Request, Response } from 'express'

import { INTERVIEW_MODES } from './interview-mode.service'

import { sendSuccess } from '@/utils/api-response'

export const interviewModeController = {
  async getAll(_req: Request, res: Response) {
    return sendSuccess(res, INTERVIEW_MODES)
  },
}