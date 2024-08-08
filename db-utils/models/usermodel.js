
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true
    },
    email: {
        type: Number,
        required: true
    },
    password: {
        type: Number,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    id:{
        type:String,
        required:true
    }
});

    
    //Model creation using schema

const userModel =new mongoose.model('users', userSchema,"users");

export { userModel};
