import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from "../modules/user/user.routes";
import interviewRoutes from "../modules/interview/interview.routes"
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middlewares - these are like security guards that check every request
app.use(helmet()); // Adds security headers
app.use(express.json());
app.use(cors({
   origin:process.env.FRONTEND_URL || "http://localhost/3000",
   credentials: true 
}))

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(errorHandler);

app.use('/api/v1/auth', authRoutes);
app.use('/api/vi/user', userRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/resume', resumeRoutes)


export default app;