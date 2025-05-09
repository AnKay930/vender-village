const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // adjust path if needed

router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // optionally add filters
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
