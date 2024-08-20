

import express from "express";
import { userModel} from "../../db-utils/models/usermodel.js";
import bcrypt from "bcryptjs";

const registerRouter = express.Router();

registerRouter.post("/",async(req,res)=>{
    const userData = req.body;
  
    //check if the user already exists
    const userObj = await userModel.findOne({email:userData.email});

    if(userObj){
        res.status(400).send({msg:"User already exists"});
    }else{
        const id = Date.now().toString();

        bcrypt.hash(userData.password,10, async (err,hash)=>{
            //store hash in your password DB.
            if(err){
                res.status(500).send({msg:"Please enter a proper password"});

            }else{
                const newUser = await new userModel({
                    ...userData,
                    password:hash,
                   id, 
            
           
           });
        await newUser.save(); //validates and inserts the record

        res.send({msg:"User saved SuccessFully"});
    }
});
 } 

});

export default  registerRouter;



