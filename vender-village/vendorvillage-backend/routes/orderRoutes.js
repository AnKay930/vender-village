const express = require("express");
const Order = require("../models/order");
const router = express.Router();

// POST /api/order/create - Place an order
router.post("/create", async (req, res) => {
  const { userId, items, customerDetails } = req.body;

  if (!userId || !items || items.length === 0 || !customerDetails) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const newOrder = new Order({
      userId,
      items,
      customerDetails,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Failed to place order." });
  }
});

// GET /api/order/customer/:userId - Fetch Customer Order History
router.get("/customer/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("items.productId"); // Populate product details

    res.json(orders);
  } catch (err) {
    console.error("Fetching customer orders failed:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

module.exports = router;
