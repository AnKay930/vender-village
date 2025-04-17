const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const router = express.Router();

// Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: "Error removing item" });
  }
});

// Update item quantity in cart (PUT /update)
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: "Error updating quantity" });
  }
});

// Clear cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
