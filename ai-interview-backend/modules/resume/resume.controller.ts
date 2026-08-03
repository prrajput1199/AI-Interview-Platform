import { Response } from "express";
import { AuthRequest } from "../../src/middlewares/auth.middleware";

const resumeService = new ResumeService();

export class ResumeController {
    async uplaodResume(req: AuthRequest, res: Response){
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
     } catch (error) {
        
     }
    }

    async deleteResume(req: AuthRequest, res: Response){
        
    }
}