import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
const authController = new AuthController();

router.post('/google',authController.googleLogin.bind(authController));
router.post('/logout',authController.logout.bind(authController));

export default router;
