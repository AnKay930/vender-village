const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: { type: String },
    userName: { type: String },
    rating: { type: Number, required: true }, // 1 to 5
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
