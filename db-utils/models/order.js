import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => Date.now().toString()
   
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  Products:{
        type:[String],
        required:true,
  }
  
});

//Model creation using schema

const OrderModel =new mongoose.model('order', orderSchema,"orders");

export { OrderModel};

