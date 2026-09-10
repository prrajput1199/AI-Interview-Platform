import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import { GeminiService } from "../../services/gemini.service";

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

const gemini = new GeminiService();

export class AnswerService {

    async submitAnswer(
        interviewId: string,
        questionId: string,
        userId: string,
        answerText: string
    ) {

        // Check that the question belongs to the interview
        const question = await prisma.question.findFirst({
            where: {
                id: questionId,
                interviewId: interviewId,
            },
        });

        if (!question) {
            throw new Error("Question not found in this interview");
        }

        // Check if this question has already been answered
        const existingAnswer = await prisma.answer.findUnique({
            where: {
                questionId: questionId,
            },
        });

        if (existingAnswer) {
            throw new Error("This question has already been answered");
        }

        // Create answer
        const answer = await prisma.answer.create({
            data: {
                questionId: questionId,
                userId: userId,
                text: answerText,
                evaluatedAt: new Date(),
            },
        });

        try {

            // Evaluate answer using Gemini
            const evaluation = await gemini.evaluateAnswer(
                question.text,
                answerText
            );

            // Update answer with evaluation
            const updatedAnswer = await prisma.answer.update({
                where: {
                    id: answer.id,
                },
                data: {
                    score: evaluation.score,
                    feedback: evaluation.feedback,
                },
            });

            return {
                answer: updatedAnswer,
                evaluation,
            };

        } catch (error) {

            console.error("Evaluation failed", error);

            return {
                answer,
                evaluation: null,
            };
        }
    }


    async completeInterview(
        interviewId: string,
        userId: string
    ) {

        // Fetch interview with questions and answers
        const interview = await prisma.interview.findFirst({
            where: {
                id: interviewId,
                userId: userId,
            },
            include: {
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

        if (!interview) {
            throw new Error("Interview not found");
        }

        // Check whether every question has an answer
        const allAnswered = interview.questions.every(
            (question) => question.answer !== null
        );

        if (!allAnswered) {
            throw new Error("Not all questions have been answered");
        }

        // Get questions
        const questions = interview.questions.map(
            (question) => question.text
        );

        // Get answers
        const answers = interview.questions.map(
            (question) => question.answer!.text
        );

        // Generate report
        const reportData = await gemini.generateReport(
            questions,
            answers
        );

        // Create report
        const report = await prisma.report.create({
            data: {
                interviewId: interviewId,

                overAllScore: reportData.overallScore,

                strengths: reportData.strengths,
                weaknesses: reportData.weaknesses,
                suggestions: reportData.suggestions,
                summary: reportData.summary,

                // confidence: reportData.confidence ?? null,
                // technical: reportData.technical ?? null,
                // communication: reportData.communication ?? null,

                // pdfUrl: reportData.pdfUrl ?? null,
            },
        });

        // Mark interview as completed
        await prisma.interview.update({
            where: {
                id: interviewId,
            },
            data: {
                status: "COMPLETED",
                score: reportData.overallScore,
            },
        });

        return report;
    }
}