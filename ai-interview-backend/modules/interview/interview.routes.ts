import { Router } from "express";
import { InterviewController } from "./interview.controller";
import { authenticator } from "../../src/middlewares/auth.middleware";

const router = Router();
const interviewController = new InterviewController();


router.use(authenticator);

router.post("/",interviewController.createInterview.bind(interviewController));