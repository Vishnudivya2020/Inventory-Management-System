// routes/auth/forgotPassword.js
import express from 'express';
import {userModel} from '../../db-utils/models/usermodel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



dotenv.config();

const PasswordRouter = express.Router();

PasswordRouter.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set the token and expiration on the user object (make sure your User model has these fields)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or another email service
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: 'your-email@gmail.com',
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of your password. 
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
      ${resetUrl}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent successfully.' });
  } catch (err) {
      console.log(err.response); // Log the full error object for debugging
      setMessage(`Error in sending reset email: ${err.response?.data?.message || err.message}`);
    }
    
  
});

export default PasswordRouter;
