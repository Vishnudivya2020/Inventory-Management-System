

// import express from 'express';
// import { userModel } from '../../db-utils/models/usermodel.js';
// import bcrypt  from  'bcryptjs';

// const loginRouter = express.Router();


// loginRouter.post('/', async (req, res) => {
//    const userData = req.body;
//     console.log("Received login data:",userData); 
//    //check if the user already exists
//    try{
//    const userObj = await userModel.findOne({email:userData.email},{__v:0,_id:0});
//    console.log(userObj);
//    if(userObj){
//      console.log("User found:",userObj);
//     //Login to handle successful login
//     //verify the password send success msg only if the password is correct.

//     bcrypt.compare(userData.password, userObj.password,async function (err, result){
//      //reslt == true
//         if(err){
//            res.status(500).send({msg:"Somthing went wrong"});
//         }else{
//             if(result){
//                 // const user = await userModel.findOne({email:userData.email});
//                 res.status(200).send({
//                 msg:"User Successfully Logged in",
//                 code:1, 
//                 user:userObj,
//             });
                
//             }else {
//                 res.status(400).send({msg:"user Credentials Failed",code:0});
//             }
//         }
//     });
//    }else{
//     res.status(404).send({msg:"User not Found"}); 
//    }
//    } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).send({ msg: "Server error during login" });
//       }
//     });
    
//     export { loginRouter };


import express from 'express';
import { userModel } from '../../db-utils/models/usermodel.js';
import { AdminModel } from '../../db-utils/models/Adminmodel.js'; // Import the Admin model
import bcrypt from 'bcryptjs';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    const { email, password, role } = req.body;

    if(!role){
        return res.status(400).send({msg:"Role  is  required"});
        
    }
    console.log("Received login data:", { email, role }); 

    try {
        // Choose the correct model based on the role
        const Model = role === 'Admin' ? AdminModel : userModel;

        const userObj = await Model.findOne({ email }, { __v:0, _id:0 });
        console.log(userObj);

        if (userObj) {
            console.log("User found:", userObj);
            
            // Verify the password
            bcrypt.compare(password, userObj.password, async function (err, result) {
                if (err) {
                    res.status(500).send({ msg: "Something went wrong" });
                } else {
                    if (result) {
                        res.status(200).send({
                            msg: "User Successfully Logged in",
                            code: 1, 
                            user: userObj,
                        });
                    } else {
                        console.log(res);
                        res.status(400).send({ msg: "User Credentials Failed", code: 0 });
                    }
                }
            });
        } else {
            res.status(404).send({ msg: "User not Found" }); 
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send({ msg: "Server error during login" });
    }
});

export { loginRouter };
