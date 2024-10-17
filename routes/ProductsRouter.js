
import express from 'express';
import { ProductModel } from '../db-utils/models/Product.js';
import { OrderModel } from '../db-utils/models/order.js';
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
  console.log(updatedProduct);

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
  console.log(ProductId)

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

// ProductRouter.patch('/:id/quantity',async(req,res) =>{
//   try{
//     const{quantityInStock} = req.body;
//     const product = await ProductModel.findByIdAndUpdate(
//       req.params.id,
//       { quantityInStock},
//       {new:true}
//     );
//     res.json(product);

//   }catch(error){
//     res.status(500).json({mes:'Failed to update quantity'});
//   }
// });

export default ProductRouter;