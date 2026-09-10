import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import { GeminiService } from "../../services/gemini.service";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path"

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

const gemini = new GeminiService();

export class PDFService {
    async generateReport(interviewId: string, userId: string) {
        //  const interview = await prisma.interview.findFirst({
        //     where:{
        //         id: interviewId,
        //         userId
        //     },
        //     include:{
        //         questions:{
        //             include:{
        //                 answer:true
        //             }
        //         },
        //         report: true
        //     },

        //  });

        const interview = await prisma.interview.findUnique({
            where: {
                id: interviewId,
            },
            include: {
                report: true,
                questions: {
                    include: {
                        answer: true,
                    },
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        if (!interview || !interview.report) {
            throw new Error("Interview or report not found")
        }

        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });

        const filename = `report_${interviewId}_${Date.now()}.pdf`;
        const filepath = path.join("uploads", filename);

        doc.pipe(fs.createWriteStream(filepath));

        this.addHeader(doc, interview);
        this.addScoreSummary(doc, interview.report);
        this.addQuestionBreakdown(doc, interview.questions);
        this.addStrengthsWeaknesses(doc, interview.report);
        this.addSuggestions(doc, interview.report);
        this.addFooter(doc);

        doc.end();

        await prisma.report.update({
            where: { id: interview.report.id },
            data: {
                pdfUrl: `/uploads/${filename}`
            }
        });

        return {
            filename,
            filepath,
            url: `/uploads/${filename}`
        }
    }

    private addHeader(doc: any, interview: any) {
        doc.fontSize(24).text("Interview Report", { align: "center" }).moveDown();

        doc.fontSize(12).text(12).text(`Interview Type : ${interview.mode}`).text(`Date: ${interview.createdAt.toLocaleDateString()}`).moveDown();
    }

    private addScoreSummary(doc: any, report: any) {
        doc.fontSize(18).text('Score Summary', { underline: true }).moveDown();

        doc.fontSize(14).text(`Overall Score: ${report.overallScore.toFixed(1)}/10`).moveDown();

        if (report.confidence) {
            doc.fontSize(12)
                .text(`Confidence: ${report.confidence.toFixed(1)}/10`)
                .text(`Communication: ${report.communication.toFixed(1)}/10`)
                .text(`Communication: ${report.technical.toFixed(1) || 'N/A'}/10`).
                moveDown()
        }

        if (report.summary) {
            doc.fontSize(12).text("Summary:").text(report.summary).moveDown()
        }
    }

    private addQuestionBreakdown(doc: any, questions: any[]) {
        doc.fontSize(18).text("Question Breakdown", { underline: true }).moveDown();

        questions.forEach((question, index) => {
            doc.fontSize(18).text(`Q${index + 1}: ${question.text}`).text(`Answer: ${question.answer?.text || `Not answered`}`).text(`Score: ${question.answer?.score?.toFixed(1) || 'N/A'}/10`);

            if (question.answer?.feedback) {
                doc.text(`feedback: ${question.answer.feedback}`)
            }

            doc.moveDown();
        })

    }

    private addStrengthsWeaknesses(doc: any, report: any) {

        doc.fontSize(18).text(`Strengths & Weaknesses`, { underline: true }).moveDown();

        //strengths
        doc.fontSize(14).text('Strengths: ').moveDown();

        report.strengths.forEach((strength: string) => {
            doc.fontSize(12).text(`${strength}`)
        });
        doc.moveDown();

        doc.fontSize(14).text('Areas for Improvement: ').moveDown();
        report.weaknesses.forEach((weakness: string) => {
            doc.fontSize(12).text(`${weakness}`)
        })
        doc.moveDown();
    }


    private addSuggestions(doc: any, report: any) {
        doc.fontSize(18).text('Improvement Suggestions', { underline: true }).moveDown();

        report.suggestions.forEach((suggestion: string, index: number) => {
            doc.fontSize(12).text(`${index + 1}.${suggestion}`)
        });

        doc.moveDown();
    }

    private addFooter(doc: any) {
        doc.fontSize(10).text('Generated by AI Interview Platform', {
            align: 'center',
            color: 'gray'
        })
    }
}