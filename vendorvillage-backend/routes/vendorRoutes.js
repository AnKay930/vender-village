const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// Add a new product
router.post("/add-product", async (req, res) => {
  const { vendorId, name, description, price, stock, image } = req.body;

  if (!vendorId || !name || !price || !stock) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newProduct = new Product({ vendorId, name, description, price, stock, image });
    await newProduct.save();
    res.json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all products for a vendor
router.get("/vendor-products/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a product
router.delete("/delete-product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Update product
router.put("/update-product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, price, name, description, image } = req.body;
    
    // Create an update object with only the fields that were provided
    const updateData = {};
    if (stock !== undefined) updateData.stock = stock;
    if (price !== undefined) updateData.price = price;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;