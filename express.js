import express from 'express';
import cors from 'cors';
import mongooseConnect from './db-utils/mongoose-connection.js';
import CustomerRouter from './routes/CustomerRouter.js';
import ProductRouter from './routes/ProductsRouter.js';
 

const server =express();
await mongooseConnect();


server.use(express.json());
server.use(cors());


 server.use("/Products",ProductRouter);
 server.use("/Customer",CustomerRouter)

const port=7000;

server.listen(port, () =>{
    console.log(Date().toString(),"server listen on Port"+ port);
});
