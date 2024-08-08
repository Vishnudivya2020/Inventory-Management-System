
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: true
      },
      email: {
        type: "String",
        required: true,
        unique: true,
       
       
      },
      password: {
        type: "String",
        required: true
      },
     role : {
        type: "array",
        required:true
      },
      
    });
    
    //Model creation using schema
    
const UserModel =new mongoose.model('User',UserSchema ,"Users");

export  { UserModel };

