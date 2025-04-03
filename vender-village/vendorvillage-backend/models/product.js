const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true }, // Ensures the product belongs to a vendor
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String }, // Store image URL or Base64 string
    brand: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
module.exports = Product;
