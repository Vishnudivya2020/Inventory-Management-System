import express from 'express';
import cors from 'cors';
import jwt from "jsonwebtoken";
import connectToDb from './db-utils/mongo-connection.js';
import mongooseConnect from './db-utils/mongoose-connection.js';
import CustomerRouter from './routes/CustomerRouter.js';
import ProductRouter from './routes/ProductsRouter.js';
import  registerRouter from './routes/auth/register.js';
import  loginRouter from './routes/auth/login.js';
import UserRouter from './routes/UserRouter.js';
import OrderRouter from './routes/orderRouter.js';
import { forgotPassword } from './routes/ForgotPassword.js';
import {resetPassword} from './routes/ResetPasswordRoter.js';
import verifyUserRouter from './routes/auth/verifyUser.js';
import dotenv from "dotenv";

dotenv.config();

const server =express();
await mongooseConnect(); 
await connectToDb();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
 
server.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allow all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies if required
  }));
  
  
//Custom middleware
const customMiddleware =(req,res,next)=>{
    console.log(
        new Date().toString(),
        "Handling request for",
        req.method,
        req.originalUrl
    );
    next();
};
//usage for all apis
server.use(customMiddleware);

const authAllApi = (req, res, next) => {
    try {
        const token = req.headers["authorization"];  // Directly get the token from the authorization header
        if (!token) {
            return res.status(403).send({ msg: "Unauthorized: Token missing" });
        }

        jwt.verify(token, process.env.JWT_SECRET);  // Verify the token without 'Bearer'
        next();
    } catch (err) {
        console.log(err.message);
        res.status(403).send({ msg: "Unauthorized" });
    }
};




 server.use("/Products",ProductRouter);
 server.use("/Customer",authAllApi,CustomerRouter);
 server.use("/users",authAllApi,UserRouter);
 server.use("/verify-user",verifyUserRouter);
 server.use("/orders",OrderRouter);
 server.use("/forgot-password",forgotPassword );
 server.use("/reset-password",resetPassword);
 server.use("/register",registerRouter);
 server.use("/login",loginRouter);
 
const port=2222;

server.listen(port, () =>{
    console.log(Date().toString(),"server listen on Port"+ port);
});


