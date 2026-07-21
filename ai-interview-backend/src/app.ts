import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from '../modules/auth/auth.routes';

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

app.use('/api/v1/auth',authRoutes);

export default app;