import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  sku: String,
  warehouse: String,
  stock: Number,
  demand: Number,
});


export const ProductModel = mongoose.model("Product", productSchema);
