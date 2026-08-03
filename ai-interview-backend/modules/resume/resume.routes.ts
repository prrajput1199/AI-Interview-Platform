import {Router} from "express";
import { authenticator } from "../../src/middlewares/auth.middleware";
import {upload} from "../../src/middlewares/upload.middleware";

const router = Router();
const resumeController = new ResumeController();

router.use(authenticator);

router.post("upload", upload.single('resume'),resumeController.uploadResume.bind(resumeController));

router.get("/",resumeController.getResume.bind(resumeController));

router.delete("/:resumeId",resumeController.deleteResume.bind(resumeController));

export default router;



