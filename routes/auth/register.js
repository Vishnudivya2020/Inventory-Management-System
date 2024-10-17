
import express from "express";
import { userModel } from "../../db-utils/models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mailOptions, transporter } from "../mail-utils.js";

const registerRouter = express.Router();

const ADMIN_SECRET_KEY = "IMS"; // Replace with your actual secret key

registerRouter.post("/", async (req, res) => {
  const userData = req.body;

  // Check if the user already exists
  const userObj = await userModel.findOne({ email: userData.email });

  if (userObj) {
    return res.status(400).send({ msg: "User already exists" });
  }

  // Check if the role is admin and validate the secret key
  if (userData.role === "admin" && userData.secretKey !== ADMIN_SECRET_KEY) {
    return res.status(403).send({ msg: "You are not authorized to register as admin" });
  }

  const id = Date.now().toString();

  bcrypt.hash(userData.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send({ msg: "Please enter a proper password" });
    }

    const newUser = new userModel({
      ...userData,
      password: hash,
      id,
      isVerified: false,
      profilePicUrl: userData.profilePicUrl || null,
    });

    const token = jwt.sign(
      { name: userData.name, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await newUser.save(); // Save the user in the database

    await transporter.sendMail({
      ...mailOptions,
      to: userData.email,
      subject: "Welcome to the Application, verify your account",
      text: `To continue, please verify your email address: ${process.env.FE_URL}/verify-account?token=${token}`,
    });

    res.send({ msg: "User saved successfully" });
  });
});

export default registerRouter;
