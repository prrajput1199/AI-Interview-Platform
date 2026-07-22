import {Response} from "express";
import { AuthRequest } from "../../src/middlewares/auth.middleware";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

export class UserController{
    async getProfile(req:AuthRequest,res:Response){
        const userId = req.user?.userId;
        try {
            const user = await prisma.user.findUnique({
                where: {id : userId},
                select: {
                    id:true,
                    email:true,
                    name:true,
                    avatarUrl:true,
                    createdAt:true,
                    creditWallet:{
                        select:{
                            balance: true
                        }
                    }
                }
            })

            if(!user){
                res.status(404).json({
                    success:false,
                    message:"user not found"
                })
            }

            res.status(200).json({
                success:true,
                data: user
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                message:"failed to get profile"
            })
        }
    }

    async updateProfile(req:AuthRequest,res:Response){
        try {
            const userId = req.user?.userId;
            const { name } = req.body;
            
            const updatedUser = await prisma.user.update({
                where : { id: userId},
                data : { name },
                select: {
                    id:true,
                    email: true,
                    name : true,
                    avatarUrl: true
                }
            })

            res.status(200).json({
                success: true,
                data: updatedUser,
                message:"Profile updated successfully"
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message:"Failed to update profile"
            })
        }
    }
}