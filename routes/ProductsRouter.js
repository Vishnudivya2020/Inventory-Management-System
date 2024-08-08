


import express from 'express';
import mongoose from "mongoose";
import {ProductModel} from "../db-utils/models/Product.js"

const ProductRouter = express.Router();

//Get all Products details
ProductRouter.get('/', async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.send(products);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

//create new Product
ProductRouter.post('/', async (req, res) => {
    const {body} =req;
    console.log("Received body:",body);
 
    try{
      //Validates a payload for the Product model
      const newProduct = await new ProductModel({
        ...body,
        id:Date.now().toString(),
      });
      await newProduct.save(); //validtes and inserts the record
      res.send({msg:"Product save successfully"});
    }catch (err){
     console.log("Error:",err)
     res.status(500).send({msg:"Something went wrong",error:err.message});
    }
 
 });


//Update a selected Product
ProductRouter.put("/:ProductId",async(req,res) =>{
    const {body} =req;
    const {ProductId} = req.params;
    try{
        const ProductObj = {
            ...body,
            id:ProductId,
        };
        await new ProductModel(ProductObj).validate();

        await ProductModel.updateOne({id:ProductId},{$set:ProductObj});
    
    res.send({msg:"Products updated successfully"})
    
    }
    catch (err) {
        console.error("Error during product save:", err);
        res.status(500).send({ msg: "Something went wrong", error: err.message });
    }
});

//Deleted a selected Product
ProductRouter.delete('/:ProductId', async (req, res) => {
    const { ProductId } = req.params;
    console.log(ProductId)

    try {
        const deletedProduct = await ProductModel.deleteOne({ id: ProductId });
        console.log(deletedProduct);
        
        if (deletedProduct.deletedCount === 0) {
            return res.status(404).send({ msg: "Product not found" });
        }

        res.send({ msg: "Product deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: err.message });
    }
});


export default ProductRouter;

