
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
   ProductName: {
        type: String,
        required: true
    },
    bought: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        required: true
    },
    availableInStock: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: 'path/to/default/image.jpg' ,
      },
    id:{
        type:String,
        required:true,
        default: () => Date.now().toString()
    },
    orderId:{
        type:String,
        required:false
    }
});

    
    //Model creation using schema

const ProductModel =new mongoose.model('Product', ProductSchema,"Products");

export { ProductModel};
