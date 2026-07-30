import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import {GeminiService} from "../../services/gemini.service"

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

const gemini = new GeminiService();

export class AnswerService{
    async submitAnswer(interviewId: string, questionId:string, userId:string,answerText:string){
      
        const question = await prisma.question.findFirst({
            where:{
                id: questionId,
                interviewId
            }
        });

        if(!question){
            throw new Error("Question not found in this interview");
        }

        const existingAnswer = await prisma.answer.findUnique({
            where:{
                id : questionId
            }
        })

        if(existingAnswer){
            throw new Error("This question has already been answered");
        }

        const Answer = await prisma.answer.create({
            data:{
                questionId,
                userId,
                text: answerText,
                evaluatedAt: new Date()
            }
        })

        try {
            const evaluation = await gemini.evaluateAnswer(question.text,answerText);

            await prisma.answer.update({
                where:{ id: Answer.id},
                data:{
                    score: evaluation.score,
                    feedback: evaluation.feedback
                }
            });

            return {
                Answer,
                evaluation
            }
        } catch (error) {
            console.error("Evaluation failed",error);
            return {Answer , evaluation:null}
        }
    }

    async completeInterview(interviewId: string,userId:string){
        const Interview = await prisma.interview.findFirst({
            where: {id:interviewId },
            include:{
                questions:{
                    include:{
                        answers:true
                    }
                }
            }
        });

        if(!Interview){
            throw new Error("Interview not found");
        }
        

        const allAnswered = Interview.questions.every(q => q.answers !== null);

        if(!allAnswered){
            throw new Error("Not all quetions has been answered");
        }

        const questions = Interview.questions.map(q => q.text);
        

        //answers is an array(Verify it)
        const answers = Interview.questions.map((q) => q.answers?.text || "Not answered");

        const reportData = await gemini.generateReport(questions,answers);

        const report = await prisma.report.create({
            data:{
                interviewId,
                overAllScore: reportData.overallScore,
                strengths: reportData.strengths,
                weaknesses: reportData.weaknesses,
                suggestions:reportData.suggestions,
                summary:reportData.summary
            }
        })

        await prisma.interview.update({
             where:{id: interviewId},
             data:{
                status:"COMPLETED",
                score:reportData.overallScore
             }
        });

        return report;
    }
}