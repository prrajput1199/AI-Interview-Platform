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

export class InterviewService{

    async createInterview(userId:string,mode:string,title?:string){
      
        const wallet = await prisma.creditwallet.findUnique({
            where: {userId}
        })

        if(!wallet || wallet.balance < 1){
            throw new Error("Insufficient credits. Please purchase more credits");
        }

        const Interview = await prisma.interview.create({
            data:{
                userId,
                mode,
                title : title || `${mode} Interview`,
                status:"CREATED",
                QuestionCount: 5
            }
        })

        await prisma.creditwallet.update({
            where: {userId},
            data: {balance : {decrement : 1}}
        });

        await prisma.creditTransaction.create({
            data:{
                userId,
                amount: -1,
                type:"USAGE",
                description:`Interview ${Interview.id}`
            }
        });

        return Interview;
    }
    
    async generateQuestions(interviewId: string){
        const interview = await prisma.interview.findUnique({
            where : {id : interviewId}
        })

        if(!interview){
            throw new Error("Interview not found");
        }

        const questions = await gemini.generateQuestions(interview.mode,"INTERMEDIATE",interview.QuestionCount);

        const savedQuestions = await Promise.all(
            questions.map((text,index)=>{
                prisma.question.create({
                    data:{
                        interviewId: interview.id,
                        text,
                        order: index +1
                    }
                })
            })
        )

        await prisma.interview.update({
            where: {id: interviewId},
            data : {status: "IN_PROGRESS"}
        })
        
       return savedQuestions;

    }
    
    async getInterviewWithQuestions(interviewId:string,userId:string){

       const interview = await prisma.interview.findFirst({
        where: { id : interviewId , userId},
        include : {
            questions: {
                orderBy : {
                    order : 'asc'
                },
                include :{
                    answer :true
                }
            },
            report: true
        },
       })

       if(!interview){
        throw new Error("Interview not found")
       }
       
       return interview;
    }

    async getInterviewHistory(userId:string,page:number = 1, limit:number= 10){
        const skip = (page-1)*limit;

        const [interview,total] = await Promise.all([prisma.interview.findMany(
            {
            where:{userId},
            orderBy: {createdAt:"desc"},
            skip,
            take:limit,
            include:{
                report:{
                    select:{
                        overAllScore:true
                    }
                }
            }
          },
          ),
        prisma.interview.count({
            where:{userId}
        })
        ]);

        return {
            interview,
            pagination:{
                page,
                limit,
                total,
                pages: Math.ceil(total/limit)
            }
        }
    }
    


}