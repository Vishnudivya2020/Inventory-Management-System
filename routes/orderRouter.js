import express from 'express';
import mongoose from "mongoose";
import {OrderModel} from "../db-utils/models/order.js";

const OrderRouter = express.Router();

//Get all Products details
OrderRouter.get('/', async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        console.log(orders)
        res.send(orders);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

//create new orders
OrderRouter.post('/', async (req, res) => {
    const {body} =req;
    console.log("Received body:",body);
 
    try{
      //Validates a payload for the Product model
      const newOrder = await new OrderModel({
        ...body,
        id:Date.now().toString(),
      });
      await newOrder.save(); //validtes and inserts the record
      res.send({msg:"OrderDetails save successfully"});
    }catch (err){
     console.log("Error:",err)
     res.status(500).send({msg:"Something went wrong",error:err.message});
    }
 
 });

 //Updating the order 
 OrderRouter.put('/:OrderId', async (req, res) => {
  const { OrderId } = req.params;
  const updatedOrder = req.body;

  try {
    const order= await OrderModel.findOneAndUpdate({ id: OrderId }, updatedOrder, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error during order update:', err);
    res.status(500).json({ msg: 'Error updating order', error: err.message });
  }
});

// Delete a Product by ID
OrderRouter.delete('/:OrderId', async (req, res) => {
  const { OrderId } = req.params;
  console.log(`Attempting to delete order with ID: ${OrderId}`);

  try {
    const deletedOrder = await OrderModel.deleteOne({ id: OrderId });
    console.log(`Delete result: ${JSON.stringify(deletedOrder)}`);
    if (deletedOrder.deletedCount === 0) {
      return res.status(404).send({ msg: 'Order not found' });
    }
    res.send({ msg: 'Order deleted successfully' });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    res.status(500).send({ msg: 'Error deleting Order', error: err.message });
  }
});


export default   OrderRouter;