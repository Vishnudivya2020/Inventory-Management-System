// routes/Customers.js
import express from 'express';
import mongoose from 'mongoose';
import {CustomerModel} from '../db-utils/models/Customer.js';
const CustomerRouter = express.Router();

//Get all Customers details
CustomerRouter.get('/', async (req, res) => {
    try {
        const Customer = await CustomerModel.find({});
        res.send(Customer);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

CustomerRouter.post('/', async (req, res) => {
    try {
        const { customerName, Email, Type, CurrentOrders, ShippingAddress, orderData,imageUrl } = req.body;

        // Check if email already exists
        const existingCustomer = await CustomerModel.findOne({ Email });
        if (existingCustomer) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Create a new customer
        const newCustomer = new CustomerModel({
            customerName,
            Email,
            Type,
            CurrentOrders,
            ShippingAddress,
            imageUrl,
            id: Date.now().toString(),
        });

        await newCustomer.save();

        if (orderData) {
            // Create a new order
            const orderId = Date.now().toString();
            const newOrder = new OrderModel({
                id: orderId,
                productName: orderData.productName,
                quantity: orderData.quantity,
                pricePerUnit: orderData.pricePerUnit,
                totalPrice: orderData.totalPrice,
                customerName: newCustomer.customerName,
                imageUrl:newCustomer.imageUrl,
                orderDate: Date.now(),
            });

            await newOrder.save();
        }

        res.status(201).send({ msg: 'Customer and order created successfully' });
    } catch (err) {
        console.error('Error creating customer and order:', err);
        res.status(500).send({ msg: 'Failed to create customer and order', error: err.message });
    }
});

//Update selected customer
 CustomerRouter.put("/:CustomerId",async(req,res) =>{
    const {body} =req;

    const {CustomerId} = req.params;
    console.log(CustomerId)
    try{
        const CustomerObj = {
            ...body,
            id:CustomerId,
        };
        console.log(CustomerObj)
        await new CustomerModel(CustomerObj).validate();

        await CustomerModel.updateOne({id:CustomerId},{$set:CustomerObj});
    
    res.send({msg:"Customer updated successfully"})
    
    }
    catch (err) {
        console.error("Error during Customer save:", err);
        res.status(500).send({ msg: "Something went wrong", error: err.message });
    }
});


     
//Deleted a selected Customer
 CustomerRouter.delete('/:CustomerId', async (req, res) => {
    const {CustomerId } = req.params;
    console.log(CustomerId)

    try {
        const deletedCustomer = await CustomerModel.deleteOne({ id:CustomerId});
        console.log(deletedCustomer);
        
        if (deletedCustomer.deletedCount === 0) {
            return res.status(404).send({ msg: "Customer not found" });
        }

        res.send({ msg: "Customer deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: err.message });
    }
});

 
export default CustomerRouter;