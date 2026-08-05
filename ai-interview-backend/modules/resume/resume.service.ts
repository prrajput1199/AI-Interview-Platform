import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import {GeminiService} from "../../services/gemini.service";
import fs from "fs";
import pdf from "pdf-parse";

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

const gemini = new GeminiService();

export class ResumeService{

    async uploadResume(userId:string,file:Express.Multer.File){
        const dataBuffer = fs.readFileSync(file.path);

        const pdfData = await pdf(dataBuffer);
        const extractedText = pdfData.text;

        const resume = await prisma.resume.create({
            data:{
                userId,
                fileName: file.originalname,
                fileURL: file.path, // In production, upload to cloud storage
                extractedText: extractedText.substring(0,5000),
                status:"PROCESSED"
            }
        })

        try {
            const analysis = await gemini.analyzeResume(extractedText);

            await prisma.resume.update({
                where : { id : resume.id},
                data:{
                      // validate what I need to update
                }
            });

            return {
                resume,
                analysis
            }
        } catch (error) {
            console.error("Resume analysis failed: ", error);
            await prisma.resume.update({
                where: {id : resume.id},
                data:{ status:"FAILED"}
            });
            throw new Error("Failed to analyze resume")
        }
    }

    async getResume(userId:string){
        return prisma.resume.findFirst({
            where: { userId},
            orderBy:{
                createdAt:"desc"
            }
        })
    }

    async deleteResume(resumeId:string, userId: string){
        const resume = await prisma.resume.findFirst({
            where: {id:resumeId, userId}
        });

        if(!resume){
            throw new Error("Resume not found");
        }

        try {
            fs.unlinkSync(resume.fileURL);
        } catch (error) {
            console.error("Failed to delete file: ", error);
        }

        return prisma.resume.delete({
            where:{id : resumeId}
        })
    }
}

