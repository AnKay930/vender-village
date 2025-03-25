const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// Add a new product
router.post("/add-product", async (req, res) => {
  const { vendorId, name, description, price, category, stock, rating, image, brand } = req.body;

  if (!vendorId || !name || !price || !category || stock === undefined || !brand) {
    return res.status(400).json({ error: "Missing required fields: vendorId, name, price, category, stock, brand" });
  }

  try {
    const newProduct = new Product({
      vendorId,
      name,
      description,
      price,
      category,
      stock,
      rating: rating || 0, // Default rating to 0 if not provided
      image,
      brand,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Database error while adding product" });
  }
});

// Get all products for a vendor
router.get("/vendor-products/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId });

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found for this vendor" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error while fetching products" });
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

    res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Database error while deleting product" });
  }
});

// Update product
router.put("/update-product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, price, name, description, category, rating, image, brand } = req.body;
    
    // Create an update object with only the provided fields
    const updateData = {};
    if (stock !== undefined) updateData.stock = stock;
    if (price !== undefined) updateData.price = price;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (rating !== undefined) updateData.rating = rating;
    if (image !== undefined) updateData.image = image;
    if (brand !== undefined) updateData.brand = brand;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, timestamps: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Database error while updating product" });
  }
});

module.exports = router;
