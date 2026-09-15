import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { prisma } from '@/prisma/client'
import { pdfService } from '@/services/pdf/pdf.service'
import { geminiService } from '@/services/gemini/gemini.service'
import { logger } from '@/utils/logger'
import { BadRequestError, ForbiddenError, NotFoundError } from '@/utils/errors'
import type { ResumeDto, ResumeUploadResultDto } from './resume.types'
import { supabaseStorageService } from '@/services/supabase/supabase.service'

const RESUME_STATUS = {
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
} as const

class ResumeService {
  async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ResumeUploadResultDto> {
    const extractedText = await pdfService.extractText(file.buffer)

    const ext = path.extname(file.originalname).toLowerCase() || '.pdf'
    const destinationPath = `resumes/${userId}/${randomUUID()}${ext}`
    await supabaseStorageService.uploadFile({
      buffer: file.buffer,
      destinationPath,
      contentType: 'application/pdf',
    })

    const existing = await prisma.resume.findMany({ where: { userId } })

    const resume = await prisma.$transaction(async (tx) => {
      if (existing.length > 0) {
        await tx.resume.deleteMany({ where: { userId } })
      }
      return tx.resume.create({
        data: {
          userId,
          fileName: file.originalname,
          fileURL: destinationPath,
          status: RESUME_STATUS.PROCESSING,
          extractedText,
        },
      })
    })

    // Best-effort cleanup of the previous file(s) — must never fail the request itself.
    await Promise.all(existing.map((r) => supabaseStorageService.deleteFileQuietly(r.fileURL)))

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
    await supabaseStorageService.deleteFileQuietly(resume.fileURL)
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

  private async toDto(resume: {
    id: string
    fileName: string | null
    fileURL: string
    status: string
    createdAt: Date
    analysis: unknown
  }): Promise<ResumeDto> {
    const fileUrl = await supabaseStorageService.getSignedDownloadUrl(resume.fileURL)

    return {
      id: resume.id,
      fileName: resume.fileName,
      fileUrl,
      status: resume.status,
      createdAt: resume.createdAt.toISOString(),
      analysis: (resume.analysis as ResumeDto['analysis']) ?? null,
    }
  }
}

export const resumeService = new ResumeService()
