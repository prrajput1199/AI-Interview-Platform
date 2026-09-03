import { Response } from "express";
import { AuthRequest } from "../../src/middlewares/auth.middleware";
import { InterviewService } from "./interview.service";
import { AnswerService } from "./answerService.service"
import { PDFService } from "../../src/services/pdf.service";

const answerService = new AnswerService()
const interviewService = new InterviewService();
const pdfService = new PDFService()
export class InterviewController {
    async createInterview(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { mode, title } = req.body;

            if (!mode) {
                return res.status(400).json({
                    success: false,
                    message: "Interview mode is Required"
                })
            }

            const interview = await interviewService.createInterview(userId, mode, title);

            res.status(201).json({
                success: true,
                data: interview,
                message: "Interview created successfully"
            })
        } catch (error: any) {
            console.error("Create Interview error", error);
            res.status(400).json({
                success: false,
                message: error.message || "failed to create Interview"
            })

        }
    }

    async generateQuestions(req: AuthRequest, res: Response) {
        try {
            const { interviewId } = req.params;

            if (typeof interviewId !== "string") {
                return res.status(400).json({
                    message: "Invalid interview ID",
                });
            }

            const questions = await interviewService.generateQuestions(interviewId);

            res.status(200).json({
                success: true,
                data: questions,
                message: "Questions generated successfully"
            })
        } catch (error: any) {
            console.error("Generate Questions error", error)
            res.status(400).json({
                success: false,
                message: error.message || "Failed to Generate questions"
            })
        }
    }

    async getInterview(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            const { interviewId } = req.params;

            if (typeof interviewId !== "string") {
                return res.status(400).json({
                    message: "Invalid interview ID",
                });
            }

            const interview = await interviewService.getInterviewWithQuestions(interviewId, userId);

            res.status(200).json({
                success: true,
                data: interview
            }
            )

        } catch (error: any) {
            console.error("Get interview error", error);

            res.status(404).json({
                success: false,
                message: error.message || "interview not found"
            })
        }
    }

    async getHistory(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;


            const history = await interviewService.getInterviewHistory(userId, page, limit);

            res.status(200).json({
                success: true,
                data: history
            })
        } catch (error) {
            console.error("Get History error", error);
            res.status(500).json({
                success: false,
                message: "Failed to get interview history"
            })
        }
    }

    async submitAnswer(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            const { interviewId } = req.params;
            const { questionId, answer } = req.body;

            if (!questionId || !answer) {
                return res.status(400).json({
                    success: false,
                    message: "Quetion ID and answer are required"
                })
            }

            if (typeof interviewId !== "string") {
                return res.status(400).json({
                    message: "Invalid interview ID",
                });
            }

            const result = await answerService.submitAnswer(interviewId, questionId, userId, answer);

            res.status(200).json({
                success: true,
                data: result,
                message: "Answer submitted successfully"
            });

        } catch (error: any) {
            console.error("Submit answer error", error);
            res.status(400).json({
                success: false,
                message: error.message || "failed to submit answer"
            })
        }
    }

    async completeInterview(req: AuthRequest, res: Response) {
        try {

            const userId = req.user!.userId;
            const { interviewId } = req.params;

            const report = await answerService.completeInterview(interviewId as any, userId);

            res.status(200).json({
                success: true,
                data: report,
                message: "Interview completed successfully"
            });

        } catch (error: any) {
            console.error("Complete Interview error: ")
            res.status(400).json({
                success: false,
                message: error.message || "Failed to complete interview"
            })
        }
    }

    async downloadReport(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            const { interviewId } = req.params;
            if (typeof interviewId !== "string") {
                return res.status(400).json({
                    message: "Invalid interview ID",
                });
            }

            if (!interviewId || !userId) {
                return res.status(400).json({
                    message: "Interview ID and user ID are required",
                });
            }


            const result = await pdfService.generateReport(interviewId, userId);

            res.download(result.filepath, result.filename);

        } catch (error: any) {
            console.error("Generate report failed", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to generate report"
            })
        }
    }

}
