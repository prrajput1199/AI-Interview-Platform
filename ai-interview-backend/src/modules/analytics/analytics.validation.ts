import { z } from 'zod'

export const trendQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).optional().default(30),
})
export type TrendQuery = z.infer<typeof trendQuerySchema>
