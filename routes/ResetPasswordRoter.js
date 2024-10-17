import express from 'express'; // Import Express
import jwt from 'jsonwebtoken'; // Import JWT
import bcrypt from 'bcryptjs'; // For password hashing
import { userModel } from '../db-utils/models/usermodel.js'; // Import your user model

const resetPassword = express.Router(); // Create a router

// GET request to verify reset token
resetPassword.get('/:token', async (req, res) => {
  const { token } = req.params; // Extract token from URL params

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use JWT_SECRET from env variables

    // Find user by the reset token and ensure the token is still valid
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token has not expired
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // If token is valid, return a success message (or render a reset password form)
    res.json({ msg: 'Token is valid, proceed to reset password' });
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    console.error('Error during token verification:', error.message);
    res.status(500).json({ msg: 'An error occurred while verifying the token' });
  }
});

// POST request to reset the password
resetPassword.post('/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // Check if token and password are provided
  if (!token || !password) {
    return res.status(400).json({ msg: 'Invalid token or password' });
  }

  if (password.length < 8) {
    return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by the reset token and ensure the token is still valid
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check token expiration
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear reset token fields
    user.password = hashedPassword; 
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear expiration
    await user.save(); // Save the updated user

    res.json({ msg: 'Password reset successfully!' });
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: 'Token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    console.error('Error during password reset:', error.message);
    res.status(500).json({ msg: 'An error occurred during password reset' });
  }
});

// Export the router
export { resetPassword };
