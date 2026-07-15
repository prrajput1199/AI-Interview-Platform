import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";


const app = express();

// Middlewares - these are like security guards that check every request
app.use(helmet()); // Adds security headers
app.use(express.json());
app.use(cors({
   origin:process.env.FRONTEND_URL || "http:/localhost/3000",
   credentials: true 
}))

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

export default app;