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

export class AnalyticsService{
    async getDashboardStats(userId: string){
         const interviews = await prisma.interview.findMany({
            where: {
                userId,
                status:"COMPLETED"
            },
            include:{
                report:true
            }
         });

         const totalInterviews = interviews.length;

         const scores = interviews.map(i => i.report?.overAllScore || 0).filter(s => s > 0);

         const averageScore = scores.length > 0 ? scores.reduce((a,b)=> a + b, 0)/scores.length : 0;

         const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
         const lowestScore = scores.length > 0 ? Math.max(...scores) : 0;

         const wallet = await prisma.creditwallet.findUnique({
            where: { userId}
         });

         const transactions = await prisma.creditTransaction.findMany({
            where : { userId }
         });

         const creditsUsed = transactions.filter(t => t.type === "USAGE").reduce((sum,t)=> sum + Math.abs(t.amount),0);

         const creditsPurchased = transactions.filter(t => t.type === 'PURCHASE').reduce((sum,t)=> sum + t.amount, 0);

        return {
            totalInterviews,
            averageScore: Math.round(averageScore * 10) / 10,
            highestScore: Math.round(highestScore * 10)/ 10,
            lowestScore: Math.round(lowestScore * 10)/10,
            creditsUsed,
            creditsPurchased,
            creditsBalance: wallet?.balance || 0
        }


    }

    async getPerformanceTrend(){

    }

    async getSkillEvaluation(){

    }
}