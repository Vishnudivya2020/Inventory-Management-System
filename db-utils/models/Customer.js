
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
      },
      Email: {
        type: String,
        required: true,
        unique: true,
       },
      Type: {
        type: String,
        required: true
      },
      CurrentOrders: {
        type: Number,
        default: 0
      },
      ShippingAddress: {
        type: String,
        required: true
      },
      id:{
        type:String,
        required:true
      }
    });
    
    //Model creation using schema
    
const CustomerModel = mongoose.model('Customer', CustomerSchema,'Customer');


export {CustomerModel };

