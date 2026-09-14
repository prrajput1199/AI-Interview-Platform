import { z } from 'zod'

export const resumeIdParamsSchema = z.object({
  resumeId: z.string().min(1, 'Resume id is required'),
})
