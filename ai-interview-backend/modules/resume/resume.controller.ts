import { Response } from "express";
import { AuthRequest } from "../../src/middlewares/auth.middleware";
import { ResumeService } from "./resume.service";

const resumeService = new ResumeService();

export class ResumeController {
    async uploadResume(req: AuthRequest, res: Response){
      try {
          const userId = req.user!.userId

          if(!req.file){
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            })
          }

          const result = await resumeService.uploadResume(userId, req.file);

          res.status(201).json({
            success: true,
            data: result,
            message: "Resume uploaded and anayzed"
          });
          
      } catch (error:any) {
          console.error("Upload Resume Error", error);
          res.status(400).json({
            success: false,
            message: error.message || "Failed to upload resume"
          })
      }
    }

    async getResume(req:AuthRequest,res: Response){
     try {
        const userId = req.user!.userId;

        const resume = await resumeService.getResume(userId);

        if(!resume){
            res.status(404).json({
                success: false,
                message:"No resume Found"
            })
        }

        res.status(200).json({
            success: true,
            data: resume
          });

     } catch (error) {
        console.error("Get Resume error");
        res.status(500).json({
            success: false,
            message:"Failed to get resume"
        })
     }
    }

    async deleteResume(req: AuthRequest, res: Response){
        try {
            const userId = req.user!.userId;
    
            const { resumeId } = req.params;

            await resumeService.deleteResume(resumeId as any, userId);

            res.status(200).json({
                success: true,
                message: "Resume Deleted Successfully"
            })
            
        } catch (error: any) {
            console.error("Delete Resume Error", error);
            res.status(404).json({
                success: false,
                message: error.message || "Failed to delete Resume"
            })
        }
    }
}