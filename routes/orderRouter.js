import express from 'express';
import mongoose from "mongoose";
import {OrderModel} from "../db-utils/models/order.js";
import { ProductModel } from '../db-utils/models/Product.js';

const OrderRouter = express.Router();

//Get all Products details
OrderRouter.get('/', async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        // console.log(orders)
        res.send(orders);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});




 //Updating the order 
 OrderRouter.put('/:OrderId', async (req, res) => {
  const { OrderId } = req.params;
  const updatedOrderData = req.body;

  try {
    const order= await OrderModel.findOneAndUpdate({ id: OrderId }, updatedOrderData, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
   
    await order.save();
    res.send({msg:"Order Updated Successfully!"});
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



// Create a new order and update the Product with NewOrderId
OrderRouter.post('/', async (req, res) => {
  const { ProductId, ...orderData } = req.body;
  console.log(orderData);

  console.log("ProductId:", ProductId);
  if (!ProductId) {
    return res.status(400).send({ msg: 'ProductId is required to create an order' });
  }

  try {
    // Generate a unique order ID
    const newOrderId = Date.now().toString();

    // Check if the product exists
    const Products = await ProductModel.findOne({ id: ProductId });
    if (!Products) {
      return res.status(404).send({ msg: 'Product not found' });
    }

    // Create new order with the ProductId
    const newOrder = new OrderModel({
      ...orderData,
      id: newOrderId,  // Order ID
      orderDate: new Date(),
      Products: [ProductId] // Reference to the product
    });

    await newOrder.save();  // Save the new order

    // Update the product to include the new OrderId
    const productUpdateResult = await ProductModel.updateOne(
      { id: ProductId },
      { $set: { orderId: newOrderId } }
    );

    if (!productUpdateResult.acknowledged) {
      return res.status(500).send({ msg: 'Failed to update the product with the new OrderId' });
    }

    // Send success response
    res.status(201).send({ msg: 'Order created and Product updated with OrderId successfully', orderId: newOrderId });

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send({ msg: 'Something went wrong', error: err.message });
  }
});






export default   OrderRouter;