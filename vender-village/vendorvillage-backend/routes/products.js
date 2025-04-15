const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Review = require("../models/review");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Add Review & Update Product Average Rating
router.post("/:id/review", async (req, res) => {
  const { userId, userName, rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // Save new review
    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      comment,
    });

    await newReview.save();

    // Recalculate average rating
    const reviews = await Review.find({ productId });

    const numReviews = reviews.length;
    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

    // Update product
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: numReviews,
    });

    res.status(201).json({ message: "Review added and rating updated." });
  } catch (err) {
    console.error("Error posting review:", err);
    res.status(500).json({ error: "Failed to post review." });
  }
});

// GET: Get All Reviews for a Product
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

module.exports = router;
