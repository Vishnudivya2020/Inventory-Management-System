import express from 'express';
import mongoose from "mongoose";
import { AdminModel } from '../db-utils/models/Adminmodel.js';

const AdminRouter = express.Router();

// Get all Admin details
AdminRouter.get('/', async (req, res) => {
    try {
        const Admin = await AdminModel.find({});
        console.log(Admin)
        res.send(Admin);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// create new user
AdminRouter.post('/', async (req, res) => {
    const {body} =req;
    console.log("Received body:",body);
 
    try{
      //Validates a payload for the Product model
      const newAdmin= await new AdminModel({
        ...body,
        id:Date.now().toString(),
      });
      await newAdmin.save(); //validtes and inserts the record
      res.send({msg:"Admin save successfully"});
    }catch (err){
     console.log("Error:",err)
     res.status(500).send({msg:"Something went wrong",error:err.message});
    }
 
 });

export default AdminRouter;





