const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    brand: { type: String, required: true },

    // For Ratings
    rating: { type: Number, default: 0 },      // Average Rating
    numReviews: { type: Number, default: 0 },  // Total Number of Reviews
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
module.exports = Product;
