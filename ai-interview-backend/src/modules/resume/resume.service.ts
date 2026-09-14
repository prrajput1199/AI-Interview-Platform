import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '@/prisma/client'
import { pdfService } from '@/services/pdf/pdf.service'
import { geminiService } from '@/services/gemini/gemini.service'
import { logger } from '@/utils/logger'
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/errors'
import type { ResumeDto, ResumeUploadResultDto } from './resume.types'

const RESUME_STATUS = {
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
} as const

class ResumeService {
  /**
   * Saves the uploaded PDF's extracted text immediately (fast, synchronous),
   * then kicks off Gemini analysis in the background without blocking the
   * response — matching the API contract's 202 Accepted / PROCESSING flow.
   * A user has at most one resume at a time: uploading replaces any existing one.
   */
  async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ResumeUploadResultDto> {
    const fileBuffer = await fs.readFile(file.path)
    const extractedText = await pdfService.extractText(fileBuffer)

    const existing = await prisma.resume.findMany({ where: { userId } })

    const resume = await prisma.$transaction(async (tx) => {
      if (existing.length > 0) {
        await tx.resume.deleteMany({ where: { userId } })
      }
      return tx.resume.create({
        data: {
          userId,
          fileName: file.originalname,
          fileURL: `/uploads/resumes/${path.basename(file.path)}`,
          status: RESUME_STATUS.PROCESSING,
          extractedText,
        },
      })
    })

    // Best-effort cleanup of the previous file(s) on disk — this must never
    // fail the request itself.
    await this.deleteFilesQuietly(existing.map((r) => r.fileURL))

    // Fire-and-forget: analyze in the background so the upload response
    // returns immediately. Errors are caught and turn the resume FAILED
    // rather than leaving it stuck in PROCESSING forever.
    void this.runAnalysis(resume.id, extractedText)

    return { resumeId: resume.id, status: resume.status }
  }

  private async runAnalysis(resumeId: string, extractedText: string): Promise<void> {
    try {
      const analysis = await geminiService.analyzeResume(extractedText)
      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: RESUME_STATUS.PROCESSED, analysis },
      })
    } catch (error) {
      logger.error({ err: error, resumeId }, 'Resume analysis failed')
      await prisma.resume
        .update({ where: { id: resumeId }, data: { status: RESUME_STATUS.FAILED } })
        .catch((updateError) =>
          logger.error({ err: updateError, resumeId }, 'Failed to mark resume as FAILED'),
        )
    }
  }

  async getCurrentResume(userId: string): Promise<ResumeDto> {
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    if (!resume) throw new NotFoundError('No resume uploaded yet')

    return this.toDto(resume)
  }

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
    if (!resume) throw new NotFoundError('Resume not found')
    if (resume.userId !== userId) throw new ForbiddenError("You can't delete another user's resume")

    await prisma.resume.delete({ where: { id: resumeId } })
    await this.deleteFilesQuietly([resume.fileURL])
  }

  /** Used internally by the interview module to resolve resume context for AI generation. */
  async getResumeForOwnershipCheck(userId: string, resumeId: string) {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
    if (!resume) throw new BadRequestError('Resume not found', 'RESUME_NOT_FOUND')
    if (resume.userId !== userId) {
      throw new ForbiddenError("You can't use another user's resume")
    }
    return resume
  }

  private toDto(resume: {
    id: string
    fileName: string | null
    fileURL: string
    status: string
    createdAt: Date
    analysis: unknown
  }): ResumeDto {
    return {
      id: resume.id,
      fileName: resume.fileName,
      fileUrl: resume.fileURL,
      status: resume.status,
      createdAt: resume.createdAt.toISOString(),
      analysis: (resume.analysis as ResumeDto['analysis']) ?? null,
    }
  }

  private async deleteFilesQuietly(fileUrls: string[]): Promise<void> {
    await Promise.all(
      fileUrls.map(async (fileUrl) => {
        const filePath = path.resolve(process.cwd(), 'uploads', 'resumes', path.basename(fileUrl))
        try {
          await fs.unlink(filePath)
        } catch {
          // File may already be gone — not worth failing the request over.
        }
      }),
    )
  }
}

export const resumeService = new ResumeService()
