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
            const analysis = await gemini.analyzeResume()
        } catch (error) {
            
        }
    }
}

