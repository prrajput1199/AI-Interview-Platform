import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import crypto from "crypto";
import Razorpay from "razorpay"   


const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

export class PaymentService{
    private razorpay : Razorpay;

    constructor(){
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!
        })
    }

    async createOrder(userId: string, credits:number){
         
        const amount = credits*100;

        const order = await this.razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `credits_${Date.now()}`,
            notes:{
                userId,
                credits
            }
        });
        
        // for now order Id and payment Id has been kept same
        const payment = await prisma.payment.create({
            data:{
                userId,
                razorPayOrderId: order.id,
                razorPayPaymentId:order.id,
                amount: amount,
                credits: credits,
                status:"CREATED"
            }
        });
        

        return {
            orderId:order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID!,
            payment
        }
    }

    async verifyPayment(
        orderId: string,
        paymentId: string,
        signature: string
    ){

        const generatedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET!).update(`${orderId} | ${paymentId}`).digest('hex');

        if(generatedSignature !== signature){
            throw new Error("Invalid payment siganture");
        }

        const payment = await prisma.payment.update({
            where: {razorPayOrderId: orderId},
            data:{
                razorpayPaymentId:paymentId,
                status:"CAPTURED"
            }
        });

        await prisma.$transaction([
            prisma.creditwallet.update({
                where:{userId:payment.userId},
                data:{
                    balance:{
                        increment:payment.credits
                    }
                }
            }),

            prisma.creditTransaction.create({
            data:{
                userId: payment.userId,
                amount:payment.credits,
                type:"PURCHASE",
                description:`Purchased ${payment.credits} credits via Razorpay`
            }
           })
        ]);

        return payment;
    }

    async handlewebHook(body: any, signature: string){
        const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET!).update(JSON.stringify(body)).digest('hex');
        

        if(expectedSignature !== signature){
            throw new Error("Invalid webhook signature");
        }


        const event = body.event;
        const payload = body.payload;

        if(event === 'payment.captured'){
            const orderId = payload.payment.entity.order_id;

            const paymentId = payload.payment.entity.id;

            const signature= payload.payment.entity.signature;

            //need to trigger verification here
            console.log("Payment captured",{orderId,paymentId});
        }

        return { received: true}
    }
    

    async getBalance(userId: string){
        const wallet = await prisma.creditwallet.findUnique({
            where: {userId}
        });

        if(!wallet){
            return prisma.creditwallet.create({
                data:{
                    userId,
                    balance:0
                }
            })
        }

        return wallet;
    }

    

}