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

   }

   async getBalance(req: AuthRequest,res:Response){

   }

   async getTransactions(req:AuthRequest,res:Response){

   }
}