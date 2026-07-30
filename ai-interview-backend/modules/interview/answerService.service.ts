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

    async completeInterview(){

    }
}