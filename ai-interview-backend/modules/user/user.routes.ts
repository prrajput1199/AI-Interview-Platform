import { Router } from "express";
import { UserController } from "./user.contoller";
import { authenticator } from "../../src/middlewares/auth.middleware";

const router = Router();

const userController = new UserController();


//All routes here require authentication
router.use(authenticator);

router.get("/profile",userController.getProfile.bind(userController));
router.patch("/profile",userController.updateProfile.bind(userController));

export default router;


