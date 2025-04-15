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

// POST: Add Review (Prevent Duplicate) & Update Product Rating
router.post("/:id/review", async (req, res) => {
  const { userId, userName, rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const existingReview = await Review.findOne({ productId, userId });

    if (existingReview) {
      return res.status(400).json({ error: "You have already submitted a review." });
    }

    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      comment,
    });

    await newReview.save();
    await updateProductRating(productId);

    res.status(201).json({ message: "Review added and rating updated." });
  } catch (err) {
    console.error("Error posting review:", err);
    res.status(500).json({ error: "Failed to post review." });
  }
});

// PUT: Update Existing Review & Recalculate Product Rating
router.put("/:id/review/:reviewId", async (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.reviewId;
  const productId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await updateProductRating(productId);

    res.json({ message: "Review updated and rating recalculated." });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Failed to update review." });
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

// Utility: Recalculate Product Average Rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });
  const numReviews = reviews.length;
  const avgRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    numReviews: numReviews,
  });
};

module.exports = router;
