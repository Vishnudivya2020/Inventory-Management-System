import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
   
   
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default:'Admin',
        enum:["Admin"],
       
    },
   id: {
        type: String,
        required: true,
       
    },

   
});


const AdminModel = mongoose.model('Admin', AdminSchema, "Admin");
export {  AdminModel };