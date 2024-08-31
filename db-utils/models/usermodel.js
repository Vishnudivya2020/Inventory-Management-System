
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
        required:true,
    },
    id: {
        type: String,
        required: true,
    },
    isVerified: {
        type: "boolean",
        required: false,
      },
});

const userModel = mongoose.model('users', userSchema, "users");

export { userModel};
