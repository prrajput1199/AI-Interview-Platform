import {Router} from "express";
import {authenticator} from "../../src/middlewares/auth.middleware";

const router = Router();

const paymentController = new PaymentController();


//webhook- no authentication is needed
router.post("/webhook", paymentController.verifyPayment.bind(paymentController));

//protected routes
router.use(authenticator);

router.post("/create-order",paymentController.createOrder.bind(paymentController));
router.post('/verify',paymentController.getBalance.bind(paymentController));
router.get("/balance", paymentController.getBalance.bind(paymentController));
router.get("/transactions",paymentController.getTransactions.bind(paymentController));;

export default router;