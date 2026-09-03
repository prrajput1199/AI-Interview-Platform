import {Request, Response} from "express";
import { AuthService } from "../../services/auth.service";

const authService = new AuthService();

export class AuthController{

    async googleLogin (req: Request, res: Response){
       try {
          const { idToken } = req.body;

          if(!idToken){
             return res.status(400).json({
                success:false,
                message:"ID token is required"
             })
          }
          
          const firebaseUser = await authService.verifyFirebaseToken(idToken);

          const user = await authService.findOrCreateUser(firebaseUser);

          const token = authService.generateJWT(user);

          res.cookie("interview_token",token,{
            httpOnly: true,
            secure:process.env.NODE_ENV === "development",
            sameSite: "lax",
            maxAge: 7*24*60*60*1000// 7 days
          })

          res.status(200).json({
            success:true,
            data:{
                user:{
                    id:user.id,
                    email:user.email,
                    name:user.name,
                    avatarUrl: user.avatarURL
                }
            },
            message:"Login Successful"
          })


       } catch (error:any) {
          console.log(error);
          res.status(401).json({
            success:false,
            messsage:error.message || "Authentication failed"
          })
       } 
    }

    async logout(req:Request,res:Response){
        res.clearCookie("interview_token");
        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })
    }
}