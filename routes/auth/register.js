import express from 'express';
import bcrypt from 'bcryptjs';
import { userModel } from '../../db-utils/models/usermodel.js';
import { AdminModel } from '../../db-utils/models/Adminmodel.js';

const registerRouter = express.Router();

registerRouter.post('/', async (req, res) => {
  console.log(req)
  const { name, email, password, role } = req.body;  // Destructure the request body

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Name, email, and password are required." }); // Ensure JSON response
  }

  if (!role) {
    return res.status(400).json({ msg: "Role is required" }); // Ensure JSON response
  }

  try {
    // Check if the user or admin already exists
    const userObj = await userModel.findOne({ email });
    const AdminObj = await AdminModel.findOne({ email });

    if (userObj || AdminObj) {
      return res.status(400).json({ msg: "User already exists" }); // Ensure JSON response
    }

    const id = Date.now().toString();

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ msg: "Error hashing the password." }); // Ensure JSON response
      }

      const newUser = {
        name,
        email,
        password: hash,
        id,
        isVerified: false,
      };

      if (role === 'Admin') {
        const admin = new AdminModel(newUser);
        await admin.save();
        return res.status(201).json({ msg: 'Admin registered successfully' }); // Ensure JSON response
      } else {
        // Save as user (default)
        const user = new userModel(newUser);
        await user.save();
        return res.status(201).json({ msg: 'User registered successfully.' }); // Ensure JSON response
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ msg: 'Server error during registration.' }); // Ensure JSON response
  }
});

export { registerRouter };

