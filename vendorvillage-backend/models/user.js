const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ["customer", "vendor"] },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
