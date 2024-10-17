import { userModel } from "../db-utils/models/usermodel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';


// Token secret for JWT
const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, 
    pass: process.env.MAIL_PASS,  
  }
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ msg: 'Please provide a valid email address.' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User with this email does not exist.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = jwt.sign({ resetToken }, JWT_SECRET, { expiresIn: '30m' });

    // Store token and expiration in the user object
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes from now
    await user.save();

    // Send email
    const resetUrl = `http://localhost:5173/reset-password/${resetPasswordToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please click the link below to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset Request',
      html: message
    });

    res.status(200).json({ msg: 'Reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export { forgotPassword };
