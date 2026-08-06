import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import {GeminiService} from "../../services/gemini.service";
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

export class PDFService{
    async generateReport(interviewId: string, userId:string){
         const interview = await prisma.interview.findFirst({
            where:{
                id: interviewId,
                userId
            },
            include:{
                questions:{
                    include:{
                        answers:true
                    }
                }
            },
            report: true
         });

         if(!interview || !interview.report){
              throw new Error("Interview or report not found")
         }

         const doc = new PDFDocument({
             size: 'A4',
             margins:{
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
             }
         });

         const filename = `report_${interviewId}_${Date.now()}.pdf`;
         const filepath = path.join("uploads",filename);

         doc.pipe(fs.createWriteStream(filepath));

         this.addHeader(doc,interview);
         this.addScoreSummary(doc,interview.report);
         this.addQuestionBreakdown(doc, interview.questions);
         this.addStrengthsWeaknesses(doc,interview.report);
         this.addSuggestions(doc, interview.report);
         this.addFooter(doc);

         doc.end();

         await prisma.report.update({
            where:{ id: interview.report.id},
            data:{
                pdfUrl: `/uploads/${filename}`
            }
         });

         return {
            filename,
            filepath,
            url: `/uploads/${filename}`
         }
    }

    private addHeader(doc: any, interview: any){
       doc.fontSize(24).text("Interview Report", { align: "center"}).moveDown();

       doc.fontSize(12).text(12).text(`Interview Type : ${interview.mode}`).text(`Date: ${interview.createdAt.toLocaleDateString()}`).moveDown();
    }
    
    private addScoreSummary(doc: any,report:any){
        doc.fontSize(18).text('Score Summary',{ underline : true}).moveDown();

        doc.fontSize(14).text(`Overall Score: ${report.overallScore.toFixed(1)}/10`).moveDown();

        if(report.confidence){
            doc.fontSize(12)
            .text(`Confidence: ${report.confidence.toFixed(1)}/10`)
            .text(`Communication: ${report.communication.toFixed(1)}/10`)
            .text(`Communication: ${report.technical.toFixed(1) || 'N/A'}/10`).
            moveDown()
        }

        if(report.summary){
            doc.fontSize(12).text("Summary:").text(report.summary).moveDown()
        }
    }

    private addQuestionBreakdown(doc: any, question: any[]){

    }

    private addStrengthsWeaknesses(doc: any, report: any){

    }
    
    private addSuggestions(doc: any, report: any){

    }
    
    private addFooter(doc: any){

    }
}