import { Request,Response, NextFunction } from "express";

export class AppError extends Error{
    statusCode: number;
    constructor(message:string, statusCode: number = 500){
        super(message);
        this.statusCode = statusCode
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);

    let statusCode = 500;
    let message = "Internal Server error"

    if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === "development" && {stack: err.stack})
    })
}
