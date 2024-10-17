import express from 'express';
import mongoose from "mongoose";
import {userModel} from '../db-utils/models/usermodel.js';

const UserRouter = express.Router();

// Get all Users details
UserRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find({});
        res.send(users);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// create a new user
UserRouter.post('/', async (req, res) => {
    const {body} =req;
    console.log("Received body:",body);
 
    try{
      //Validates a payload for the Product model
      const newusers = await new userModel({
        ...body,
        id:Date.now().toString(),
      });
      await newusers.save(); //validtes and inserts the record
      res.send({msg:"Users save successfully"});
    }catch (err){
     console.log("Error:",err)
     res.status(500).send({msg:"Something went wrong",error:err.message});
    }
 
 });

 UserRouter.delete('/:UserId', async (req, res) => {
  const { UserId } = req.params;

  try {
    const deletedUser = await userModel.deleteOne({ id: UserId });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).send({ msg: 'User not found' });
    }
    res.send({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Error deleting User', error: err.message });
  }
});

export default UserRouter ;

