import express from 'express';
import cors from 'cors';
import mongooseConnect from './db-utils/mongoose-connection.js';
import CustomerRouter from './routes/CustomerRouter.js';
import ProductRouter from './routes/ProductsRouter.js';
import  registerRouter from './routes/auth/register.js';
import  loginRouter from './routes/auth/login.js';
import UserRouter from './routes/UserRouter.js';
import AdminRouter from './routes/AdminRouter.js';

const server =express();
await mongooseConnect();  


server.use(express.json());
server.use(cors());

const customMiddleware =(req,res,next)=>{
    console.log(
        new Date().toString(),
        "Handling request for",
        req.method,
        req.originalUrl
    );
    next();
};

server.use(customMiddleware);


 server.use("/Products",ProductRouter);
 server.use("/Customer",CustomerRouter);
 server.use("/register",registerRouter);
 server.use("/login",loginRouter);
 server.use("/users",UserRouter);
 server.use("/admin",AdminRouter);
 
const port=2222;

server.listen(port, () =>{
    console.log(Date().toString(),"server listen on Port"+ port);
});
