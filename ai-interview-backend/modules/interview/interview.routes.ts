import { Router } from "express";
import { InterviewController } from "./interview.controller";
import { authenticator } from "../../src/middlewares/auth.middleware";

const router = Router();
const interviewController = new InterviewController();


router.use(authenticator);

router.post("/",interviewController.createInterview.bind(interviewController));
router.post("/:interviewId/generate",interviewController.generateQuestions.bind(interviewController));
router.get("/:interviewId",interviewController.getInterview.bind(interviewController));
router.get("/",interviewController.getHistory.bind(interviewController));
router.post("/:interviewId/answer",interviewController.submitAnswer.bind(interviewController))
router.post("/:interviewId/complete",interviewController.completeInterview.bind(interviewController))
router.get('/interviewId/report',interviewController.downloadReport.bind(interviewController))
export default router;