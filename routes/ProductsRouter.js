// import express from 'express';
// import mongoose from "mongoose";
// import { db } from '../db-utils/mongo-connection.js';
// import {ProductModel} from "../db-utils/models/Product.js"

// const ProductRouter = express.Router();

// //Get all Products details
// ProductRouter.get('/', async (req, res) => {
//     try {
//         const products = await ProductModel.find({});
//         res.send(products);
//     } catch (err) {
//         res.status(500).json({ message: "Something went wrong" });
//     }
// });

// //create new Product
// ProductRouter.post('/', async (req, res) => {
//     const {body} =req;
//     console.log("Received body:",body);
 
//     try{
//       //Validates a payload for the Product model
//       const newProduct = await new ProductModel({
//         ...body,
//         id:Date.now().toString(),
//       });
//       await newProduct.save(); //validtes and inserts the record
//       res.send({msg:"Product save successfully"});
//     }catch (err){
//      console.log("Error:",err)
//      res.status(500).send({msg:"Something went wrong",error:err.message});
//     }
 
//  });


// //Update a selected Product
// ProductRouter.put("/:ProductId",async(req,res) =>{
//     const {body} =req;
//     const {ProductId} = req.params;
//     try{
//         const ProductObj = {
//             ...body,
//             id:ProductId,
//         };
//         await new ProductModel(ProductObj).validate();

//         await ProductModel.updateOne({id:ProductId},{$set:ProductObj});
    
//     res.send({msg:"Products updated successfully"})
    
//     }
//     catch (err) {
//         console.error("Error during product save:", err);
//         res.status(500).send({ msg: "Something went wrong", error: err.message });
//     }
// });

// //Deleted a selected Product
// ProductRouter.delete('/:ProductId', async (req, res) => {
//     const { ProductId } = req.params;
//     console.log(ProductId)

//     try {
//         const deletedProduct = await ProductModel.deleteOne({ id: ProductId });
//         console.log(deletedProduct);
        
//         if (deletedProduct.deletedCount === 0) {
//             return res.status(404).send({ msg: "Product not found" });
//         }

//         res.send({ msg: "Product deleted successfully" });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ msg: "Something went wrong", error: err.message });
//     }
// });



// ProductRouter.patch('/assign_orderId/:ProductId', async (req, res) => {
//     const { orderId } = req.body;
//     const { ProductId } = req.params;

//     console.log(`Received ProductId: ${ProductId}, orderId: ${orderId}`);

//     // Check if orderId is null
//     if (orderId == null) {
//         return res.status(400).send({ msg: 'orderId cannot be null' });
//     }

//     // Check whether the product exists
//     const ProObj = await db.collection('Products').findOne({ id: ProductId });
//     console.log('Product Found:', ProObj);

//     // Check whether the order exists
//     const orderObj = await db.collection('orders').findOne({ id: String(orderId) });
//     console.log('Order Found:', orderObj);

//     if (ProObj && orderObj) {
//         // Update the product with the orderId
//         await db
//             .collection('Products')
//             .updateOne({ id: ProductId }, { $set: { orderId } });

//         // Add product to the order
//         await db
//             .collection('orders')
//             .updateOne(
//                 { id: String(orderId) },
//                 { $push: { Products: ProductId } }
//             );

//         res.status(200).send({ msg: 'OrderId assigned successfully' });
//     } else if (!ProObj) {
//         res.status(400).send({ msg: 'Product not found, please check ProductId' });
//     } else {
//         res.status(400).send({ msg: 'Order not found, please check orderId' });
//     }
// });

// // Update a selected Product in FE
// ProductRouter.put('/:ProductsId', async (req, res) => {
//     const { id } = req.params;
//     const updatedProduct = req.body;
//     try {
//       const product = await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//       res.json(product);
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating product' });
//     }
//   });

//   //Adding new product in FE
//   ProductRouter.post("/", async (req, res) => {
//     try {
//       const newProduct = new ProductModel(req.body);  // Assuming you're using Mongoose or a similar ORM
//       const savedProduct = await newProduct.save();
//       res.status(201).json(savedProduct);
//     } catch (error) {
//       res.status(500).json({ msg: 'Failed to add product', error: error.message });
//     }
//   });
  




// export default ProductRouter;
import express from 'express';
import { ProductModel } from '../db-utils/models/Product.js';
 import { db } from '../db-utils/mongo-connection.js';
const ProductRouter = express.Router();

// Get all Products
ProductRouter.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.send(products);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Create a new Product
ProductRouter.post('/', async (req, res) => {
  const { body } = req;
  console.log('Received body:', body);

  try {
    const newProduct = new ProductModel({
      ...body,
      id: Date.now().toString(),
    });
    await newProduct.save();
    res.status(201).send({ msg: 'Product saved successfully', product: newProduct });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ msg: 'Failed to add product', error: err.message });
  }
});

// Update a Product by ID
ProductRouter.put('/:ProductId', async (req, res) => {
  const { ProductId } = req.params;
  const updatedProduct = req.body;

  try {
    const product = await ProductModel.findOneAndUpdate({ id: ProductId }, updatedProduct, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error during product update:', err);
    res.status(500).json({ msg: 'Error updating product', error: err.message });
  }
});

// Delete a Product by ID
ProductRouter.delete('/:ProductId', async (req, res) => {
  const { ProductId } = req.params;

  try {
    const deletedProduct = await ProductModel.deleteOne({ id: ProductId });
    if (deletedProduct.deletedCount === 0) {
      return res.status(404).send({ msg: 'Product not found' });
    }
    res.send({ msg: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Error deleting product', error: err.message });
  }
});

// Assign Order ID to a Product
ProductRouter.patch('/assign_orderId/:ProductId', async (req, res) => {
  const { orderId } = req.body;
  const { ProductId } = req.params;

  if (!orderId) {
    return res.status(400).send({ msg: 'orderId cannot be null' });
  }

  try {
    const product = await ProductModel.findOne({ id: ProductId });
    if (!product) {
      return res.status(404).send({ msg: 'Product not found' });
    }

    // Assuming there's a separate Order model
    const order = await db.collection('orders').findOne({ id: String(orderId) });
    if (!order) {
      return res.status(404).send({ msg: 'Order not found' });
    }

    product.orderId = orderId;
    await product.save();

    // Add product to the order (assuming orders collection structure)
    await db.collection('orders').updateOne(
      { id: String(orderId) },
      { $push: { Products: ProductId } }
    );

    res.status(200).send({ msg: 'OrderId assigned successfully' });
  } catch (err) {
    console.error('Error assigning order ID:', err);
    res.status(500).send({ msg: 'Something went wrong', error: err.message });
  }
});

export default ProductRouter;

