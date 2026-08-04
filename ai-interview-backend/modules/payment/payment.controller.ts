import { Response } from "express";;
import { AuthRequest } from "../../src/middlewares/auth.middleware";


const paymentService = new PaymentService();

export class PaymentController{

   async createOrder(req: AuthRequest,res:Response){

    try {
        const userId = req.user!.userId;

        const { credits } = req.body;

        if(!credits || credits < 1){
          return res.status(400).json({
              success: false,
              message:"Please specify number of credits(minimum 1)"
          })
        }

        const order = await paymentService.createIOrder(userId, credits);

        res.status(200).json({
              success: true,
              data: order,
              message:"Order created successfully"
        })
        
    } catch (error:any) {
        console.error("Create order error",error)
        res.status(400).json({
            success:false,
            message: error.message || "Failed to create order"
        })
    }
   }

   async verifyPayment(req: AuthRequest, res: Response){
    try {
        const userId = req.user!.userId;
        const {orderId, paymentId, signature} = req.body;

        if(!orderId || !paymentId || !signature){
           return res.status(400).json({
               success: false,
               message:"Missing required fields"
           });
        }

        const payment = await paymentService.verifyPayment(orderId,paymentId,signature);

        res.status(200).json({
           success: true,
           data:payment,
           message:"Payment verified and credits added"
        })
    } catch (error:any) {
        console.error("Verify payment error",error);
        res.status(400).json({
            success:false,
            message:error.message || "Payment Verification Failed"
        })
    }

   }

   async getBalance(req: AuthRequest,res:Response){
    try {
        
        const userId = req.user!.userId;
   
        const wallet = await paymentService.getBalance(userId);
   
        res.status(200).json({
           success: true,
           data: wallet
        });

    } catch (error:any) {
        console.error("Get balance error",error);
        res.status(400).json({
            success:false,
            message: error.message || "Failed to get balance"
        })
    }
   }

   async getTransactions(req:AuthRequest,res:Response){

    try {
        
        const userId = req.user!.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    
        const history = await paymentService.getTransactions(userId,page,limit);
    
        res.status(200).json({
            success: true,
            data: history
        });

    } catch (error:any) {
        console.error("Get Transactions error",error);
        res.status(400).json({
            success:false,
            message: error.message || "Failed to get Transactions"
        })
    }



    



   }
}