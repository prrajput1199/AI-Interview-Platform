import { Router } from "express";
import { authenticator } from "../../src/middlewares/auth.middleware";
import { AnalyticsController } from "./analytics.controller";


const router = Router();

const analyticsController = new AnalyticsController();

router.use(authenticator);

router.get('/dashboard',analyticsController.getDashboardStats.bind(analyticsController))
router.get('/trend',analyticsController.getPerformanceTrend.bind(analyticsController))
router.get('/skills',analyticsController.getSkillEvaluation.bind(analyticsController));
router.get('/questions',analyticsController.getQuestionPerformance.bind(analyticsController));

export default router;