import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?:{
        userId:string,
        email:string
    }
}

export const authenticator = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.interview_token;

        if(!token){
            return res.status(401).json({
                success: false,
                message : "Authentication Required. Please Login"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as {
            userId:string,
            email:string
        }
        
        //add user info to the request
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:"Invalid or expired token. Please login again"
        })
    }
}