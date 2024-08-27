import  express from "express";
import bcrypt from  "bcryptjs";
 import jwt from "jsonwebtoken";
import { userModel } from "../../db-utils/models/usermodel.js";
 import {db} from "../../db-utils/mongo-connection.js";
const loginRouter = express.Router();

loginRouter.post("/",async(req,res)=>{
    const userData = req.body;


    //check if the user already exists
    const userObj = await userModel.findOne({email:userData.email});

    if(userObj){
        //Login to handle successful login
        //verify the password send success message only if the password is correct

    bcrypt.compare(userData.password,userObj.password, async function(err,result){
        //result = true
        if(err) {
            res.status(500).send({msg:"somthing went wrong"});

        }else{
            if(result){
                // console.log("userObj:",userObj);
                // const User=await userModel.findOne(
                    const collection = db.collection("users");
                    const User = await collection.findOne(
                    {email:userData.email},
                    {
                      projection:{ password:0,__v:0,_id:0}
                    }
                );
           var token = jwt.sign(User,process.env.JWT_SECRET,{
            expiresIn:"1day",
        });
           console.log(token )
             
               res.status(200).send({
                msg:'User Successfully Logged in',
                code:1,
                User,
                 token,
            });
            }else{
                res.status(400).send({msg:"user Credentials failed",code:0});
            }
        }
    });
    
    }else{
      res.status(404).send({msg:"user not found"});
    }
});
export default  loginRouter ;

// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { userModel } from "../../db-utils/models/usermodel.js";

// const loginRouter = express.Router();

// loginRouter.post("/", async (req, res) => {
//     const userData = req.body;

//     // Check if the user already exists
//     const userObj = await userModel.findOne({ email: userData.email });

//     if (userObj) {
//         // Verify the password
//         bcrypt.compare(userData.password, userObj.password, async function (err, result) {
//             if (err) {
//                 res.status(500).send({ msg: "Something went wrong" });
//             } else {
//                 if (result) {
//                     console.log("userObj:", userObj);

//                     // Create a plain object containing the user data to include in the token
//                     const userPayload = {
//                         id: userObj.id,
//                         name: userObj.name,
//                         email: userObj.email,
//                         role: userObj.role,
//                     };

//                     // Sign the JWT token
//                     const token = jwt.sign(userPayload, "shhhhh", {
//                         expiresIn: "1d", // Set token expiration to 1 day
//                     });

//                     console.log("Generated Token:", token);

//                     res.status(200).send({
//                         msg: 'User Successfully Logged in',
//                         code: 1,
//                         User,
//                         token,
//                     });
//                 } else {
//                     res.status(400).send({ msg: "User credentials failed", code: 0 });
//                 }
//             }
//         });
//     } else {
//         res.status(404).send({ msg: "User not found" });
//     }
// });

// export default loginRouter;



