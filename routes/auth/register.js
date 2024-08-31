

import express from "express";
import { userModel} from "../../db-utils/models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mailOptions, transporter } from "../mail-utils.js";

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
                   isVerified:false,
             });
             var token = jwt.sign(
                {name:userData.name,email:userData.email},
                process.env.JWT_SECRET,
                {
                expiresIn:"15m",
             }
            );
        await newUser.save(); //validates and inserts the record
         await transporter.sendMail({
        ...mailOptions,
        to: userData.email, 
        subject:"Welcome to the Application,verify Accound",
        text:`To continue,Please verify your Email Address ${process.env.FE_URL}/verify-account?token=${token}`,

         });
        res.send({msg:"User saved SuccessFully"});
    }
});
 } 

});
 
export default  registerRouter;



