import express from "express";
import userModel from "../../db-utils/models/user";

const userRouter = express.Router();

userRouter.post("/",async (req,res)=>{
    const userData =req.body;

    //check if the user already exists
    const userObj = await userModel.findOne({email:userData.email});
     if(userObj){
        res.status(400).send({msg:"User  already exists"});
     }else {
        const id = Date.now().toString();
        const newUser = await new userModel({
           ...userObj,
           id,
        });
        await newUser.save();
        res.send({msg:"user saved successfully"});
     }
});