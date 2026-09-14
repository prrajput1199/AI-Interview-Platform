import PDFDocument from 'pdfkit'
import { PDFParse } from 'pdf-parse'
import { logger } from '@/utils/logger'
import { BadRequestError } from '@/utils/errors'

interface ReportPdfInput {
  interviewTitle: string
  mode: string
  overallScore: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  questions: Array<{
    order: number
    text: string
    answerText: string | null
    score: number | null
    feedback: string | null
  }>
}

class PdfService {
  async extractText(fileBuffer: Buffer): Promise<string> {
    if (fileBuffer.subarray(0, 4).toString('ascii') !== '%PDF') {
      throw new BadRequestError('The uploaded file is not a valid PDF', 'INVALID_PDF')
    }

    try {
      const parser = new PDFParse({ data: fileBuffer })
      const result = await parser.getText()
      await parser.destroy()

      const text = result.text.trim()
      if (!text) {
        throw new BadRequestError(
          "We couldn't read any text from that PDF — it may be a scanned image.",
          'EMPTY_PDF_TEXT',
        )
      }
      return text
    } catch (error) {
      if (error instanceof BadRequestError) throw error
      logger.error({ err: error }, 'Failed to parse resume PDF')
      throw new BadRequestError('That PDF could not be read. Please try a different file.', 'INVALID_PDF')
    }
  }

  /** Streams a formatted interview report as PDF bytes. */
  async generateInterviewReportPdf(input: ReportPdfInput): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
    })

    doc.fontSize(20).text(input.interviewTitle, { align: 'left' })
    doc.fontSize(11).fillColor('#666666').text(input.mode.replace(/_/g, ' '))
    doc.moveDown(1.2)

    doc.fillColor('#000000').fontSize(14).text(`Overall score: ${input.overallScore.toFixed(1)} / 10`)
    doc.moveDown(0.6)
    doc.fontSize(11).fillColor('#333333').text(input.summary, { align: 'left' })
    doc.moveDown(1)

    addBulletSection(doc, 'Strengths', input.strengths)
    addBulletSection(doc, 'Weaknesses', input.weaknesses)
    addBulletSection(doc, 'Suggestions', input.suggestions)

    doc.moveDown(0.5)
    doc.fillColor('#000000').fontSize(14).text('Question-by-question')
    doc.moveDown(0.4)

    for (const q of input.questions) {
      doc.fontSize(11).fillColor('#000000').text(`${q.order}. ${q.text}`, { align: 'left' })
      if (q.answerText) {
        doc.fontSize(10).fillColor('#444444').text(`Answer: ${q.answerText}`)
      }
      if (q.score !== null) {
        doc.fontSize(10).fillColor('#444444').text(`Score: ${q.score.toFixed(1)} / 10`)
      }
      if (q.feedback) {
        doc.fontSize(10).fillColor('#444444').text(`Feedback: ${q.feedback}`)
      }
      doc.moveDown(0.8)
    }

    doc.end()
    return done
  }
}

function addBulletSection(doc: PDFKit.PDFDocument, title: string, items: string[]) {
  if (items.length === 0) return
  doc.fontSize(13).fillColor('#000000').text(title)
  doc.moveDown(0.2)
  for (const item of items) {
    doc.fontSize(10.5).fillColor('#333333').text(`•  ${item}`)
  }
  doc.moveDown(0.8)
}

export const pdfService = new PdfService()
