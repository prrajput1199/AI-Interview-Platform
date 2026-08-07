import { Response } from "express";
import { AuthRequest } from "../../src/middlewares/auth.middleware";
import { AnalyticsService } from "./analytics.service";


const analyticsService = new AnalyticsService();
export class AnalyticsController {
    async getDashboardStats(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            const stats = await analyticsService.getDashboardStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            })
        } catch (error: any) {
            console.error("Get dashboard stats error", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get dashboard stats"
            })
        }
    }

    async getPerformanceTrend(req: AuthRequest, res: Response) {

        try {
            const userId = req.user!.userId;
            const days = parseInt(req.query.days as string) || 30;
            
            const trend  = await analyticsService.getPerformanceTrend(userId,days);

            res.status(200).json({
                success: true,
                data: trend
            })
        } catch (error: any) {
            console.error("Get performance trend error", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get Performance Trend error"
            })
        }

    }

    async getSkillEvaluation(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            const skils = await analyticsService.getSkillEvaluation(userId);

            res.status(200).json({
                success: true,
                data: skils
            })
        } catch (error: any) {
            console.error("Get skill evaluation error", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get skill evaluation"
            })
        }
    }

    async getQuestionPerformance(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            const performance = await analyticsService.getDashboardStats(userId);

            res.status(200).json({
                success: true,
                data: performance
            })
        } catch (error: any) {
            console.error("Get question performance error", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get question performance"
            })
        }
    }
}