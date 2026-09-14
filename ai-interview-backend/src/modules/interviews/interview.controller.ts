import type { Request, Response } from 'express'
import { interviewService } from './interview.service'
import { pdfService } from '@/services/pdf/pdf.service'
import { sendCreated, sendSuccess } from '@/utils/api-response'
import type { CreateInterviewInput, ListInterviewsQuery, SubmitAnswerInput } from './interview.validation'


export const interviewController = {
  async create(req: Request, res: Response) {
    const result = await interviewService.createInterview(req.user!.id, req.body as CreateInterviewInput)
    return sendCreated(res, result, 'Interview created successfully')
  },

  async generateQuestions(req: Request, res: Response) {
    const questions = await interviewService.generateQuestions(req.user!.id, req.params.interviewId as string)
    return sendSuccess(res, questions, 'Questions generated successfully')
  },

  async getDetail(req: Request, res: Response) {
    const interview = await interviewService.getInterviewDetail(req.user!.id, req.params.interviewId as string)
    return sendSuccess(res, interview)
  },

  async submitAnswer(req: Request, res: Response) {
    const result = await interviewService.submitAnswer(
      req.user!.id,
      req.params.interviewId as string,
      req.body as SubmitAnswerInput,
    )
    return sendSuccess(res, result, 'Answer submitted and evaluated')
  },

  async complete(req: Request, res: Response) {
    const report = await interviewService.completeInterview(req.user!.id, req.params.interviewId as string) 
    return sendSuccess(res, report, 'Interview completed successfully')
  },

  async list(req: Request, res: Response) {
    const { page, limit } = req.validatedQuery as unknown as ListInterviewsQuery
    const result = await interviewService.listInterviews(req.user!.id, { page, limit })
    return sendSuccess(res, result)
  },

  async downloadReportPdf(req: Request, res: Response) {
    const data = await interviewService.getReportForPdf(req.user!.id, req.params.interviewId as string) 
    const pdfBuffer = await pdfService.generateInterviewReportPdf(data)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=interview-report-${req.params.interviewId}.pdf`,
    )
    res.status(200).send(pdfBuffer)
  },
}


